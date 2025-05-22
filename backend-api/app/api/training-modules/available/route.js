// app/api/training-modules/available/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// GET modules available for purchase with purchase status
export async function GET(request) {
    let connection;
    try {
        // Authenticate the user (allow both admin and park_guide roles)
        const { uid, role } = await assertUser(request, [
            "admin",
            "park_guide",
        ]);

        // Get user_id from the Users table based on the firebase uid
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

        const userId = userRows[0].user_id; // Get all modules with purchase status for this user
        const [rows] = await connection.execute(
            `            SELECT                tm.module_id AS id,
                tm.module_name AS name,
                tm.description,
                COALESCE(tm.price, 0.00) as price,
                CONCAT('${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
                }/module-images/', tm.module_id, '.jpg') AS imageUrl,
                CASE
                    WHEN mp.purchase_id IS NOT NULL AND mp.status = 'active' THEN 'purchased'
                    WHEN mp.purchase_id IS NOT NULL AND mp.status = 'pending' THEN 'pending'
                    ELSE 'not_purchased'                END AS purchase_status,                tm.is_compulsory
            FROM TrainingModules tm
            LEFT JOIN ModulePurchases mp ON tm.module_id = mp.module_id AND mp.user_id = ? AND mp.is_active = TRUE
            ORDER BY tm.module_id ASC
        `,
            [userId]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching available modules:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch available modules" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
