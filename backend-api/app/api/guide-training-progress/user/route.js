import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

export async function GET(request) {
    let connection;
    try {
        // Authenticate the user (park guide role)
        const { uid } = await assertUser(request, ["park_guide"]);

        // Get user_id from Users table using Firebase uid
        connection = await getConnection();
        const [userRows] = await connection.execute(
            "SELECT user_id FROM Users WHERE uid = ?",
            [uid]
        );

        if (userRows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userId = userRows[0].user_id;

        // Get guide_id from ParkGuides table
        const [guideRows] = await connection.execute(
            "SELECT guide_id FROM ParkGuides WHERE user_id = ?",
            [userId]
        );

        if (guideRows.length === 0) {
            return NextResponse.json(
                { error: "Park guide record not found" },
                { status: 404 }
            );
        }

        const guideId = guideRows[0].guide_id;

        // Fetch training progress for the guide
        // Join with ModulePurchases and PaymentTransactions to check payment status
        const [progressRows] = await connection.execute(
            `SELECT 
                gtp.progress_id,
                gtp.guide_id,
                gtp.module_id,
                gtp.status,
                gtp.start_date,
                gtp.completion_date,
                tm.module_name,
                tm.description,
                mp.status as purchase_status,
                pt.paymentStatus as payment_status
            FROM GuideTrainingProgress gtp
            JOIN TrainingModules tm ON gtp.module_id = tm.module_id
            LEFT JOIN (
                SELECT mp.* 
                FROM ModulePurchases mp 
                WHERE mp.user_id = ? AND mp.is_active = TRUE
            ) mp ON mp.module_id = gtp.module_id
            LEFT JOIN PaymentTransactions pt ON mp.payment_id = pt.payment_id
            WHERE gtp.guide_id = ?
            AND (
                tm.price = 0 OR tm.price = '0' OR tm.price = '0.00' OR  -- Free modules
                (mp.status = 'active' AND pt.paymentStatus = 'approved') -- Paid modules with approved payments
            )
            ORDER BY gtp.completion_date DESC, gtp.start_date DESC`,
            [userId, guideId]
        );

        return NextResponse.json(progressRows);
    } catch (error) {
        console.error("Error fetching guide training progress:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch training progress" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    );
}
