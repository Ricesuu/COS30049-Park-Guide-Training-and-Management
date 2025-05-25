// api/training-modules/[id]/enroll/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// POST: Direct enrollment for free modules
export async function POST(request, { params }) {
    let connection;
    try {
        const moduleId = params.id;

        // Authenticate the user - allow both park_guide and admin roles
        const { uid, role } = await assertUser(request, [
            "park_guide",
            "admin",
        ]);

        connection = await getConnection();

        // First get user_id from uid
        const [users] = await connection.execute(
            `SELECT user_id FROM Users WHERE uid = ?`,
            [uid]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userId = users[0].user_id; // Check if module exists and is free
        const [modules] = await connection.execute(
            `SELECT module_id, module_name, price 
       FROM TrainingModules 
       WHERE module_id = ?`,
            [moduleId]
        );
        if (modules.length === 0) {
            return NextResponse.json(
                { error: "Module not found" },
                { status: 404 }
            );
        }

        const moduleData = modules[0];

        // Check if it's a free module based on price
        if (
            moduleData.price !== 0 &&
            moduleData.price !== "0" &&
            moduleData.price !== "0.00"
        ) {
            return NextResponse.json(
                {
                    error: "This is a premium module and requires payment",
                },
                { status: 400 }
            );
        }

        // Check if user already has this module
        const [existingPurchases] = await connection.execute(
            `SELECT purchase_id FROM ModulePurchases 
       WHERE user_id = ? AND module_id = ? AND is_active = TRUE`,
            [userId, moduleId]
        );

        if (existingPurchases.length > 0) {
            return NextResponse.json({
                message: "You are already enrolled in this module",
            });
        } 
        
        // Create a "free" payment record with an empty BLOB for receipt_image (since it can't be NULL)
        const [paymentResult] = await connection.execute(
            `INSERT INTO PaymentTransactions 
       (user_id, uid, paymentPurpose, paymentMethod, amountPaid, receipt_image, paymentStatus, transaction_date, module_id) 
       VALUES (?, ?, ?, ?, ?, UNHEX(''), 'approved', NOW(), ?)`,
            [
                userId,
                uid,
                `Free Module: ${moduleData.module_name}`,
                "debit", // Using 'debit' instead of 'free' to match ENUM values
                0,
                moduleId,
            ]
        );

        const paymentId = paymentResult.insertId;

        // Create ModulePurchases record
        await connection.execute(
            `INSERT INTO ModulePurchases 
       (user_id, module_id, payment_id, status, is_active) 
       VALUES (?, ?, ?, 'active', TRUE)`,
            [userId, moduleId, paymentId]
        );

        // Also track in training progress
        try {
            const [guideRows] = await connection.execute(
                `SELECT guide_id FROM ParkGuides WHERE user_id = ?`,
                [userId]
            );

            if (guideRows.length > 0) {
                const guideId = guideRows[0].guide_id;

                // Add training progress record
                await connection.execute(
                    `INSERT IGNORE INTO GuideTrainingProgress 
          (guide_id, module_id, status) 
          VALUES (?, ?, 'in progress')`,
                    [guideId, moduleId]
                );
            }
        } catch (err) {
            console.error("Error creating training progress record:", err);
            // Don't fail the entire transaction if this part fails
        }

        return NextResponse.json({
            message: "Successfully enrolled in free module",
            moduleId,
            status: "active",
        });
    } catch (error) {
        console.error("Error enrolling in free module:", error);
        return NextResponse.json(
            { error: error.message || "Failed to enroll in module" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
