// app/api/training-modules/user/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// GET modules purchased by the current authenticated user
export async function GET(request) {
    let connection;
    try {
        // Authenticate the user (allow both admin and park_guide roles)
        const { uid, role } = await assertUser(request, ["admin", "park_guide"]);

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

        const userId = userRows[0].user_id;        // Get the modules purchased by this user
        const [rows] = await connection.execute(`
            SELECT 
                tm.module_id AS id,
                tm.module_name AS name,
                tm.description,
                tm.duration,
                CONCAT('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/module-images/', tm.module_id, '.jpg') AS imageUrl,
                CONCAT('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/module-videos/', tm.module_id, '.mp4') AS videoUrl,
                mp.purchase_date,
                mp.completion_percentage
            FROM ModulePurchases mp
            JOIN TrainingModules tm ON mp.module_id = tm.module_id
            WHERE mp.user_id = ? AND mp.status = 'active' AND mp.is_active = TRUE
            ORDER BY mp.purchase_date DESC
        `, [userId]);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching user modules:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch user modules" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
