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

        // Fetch park guide information
        const [guideRows] = await connection.execute(
            `SELECT 
                pg.guide_id, 
                pg.user_id, 
                pg.certification_status, 
                pg.license_expiry_date, 
                pg.assigned_park
            FROM ParkGuides pg
            WHERE pg.user_id = ?`,
            [userId]
        );

        if (guideRows.length === 0) {
            return NextResponse.json(
                { error: "Park guide record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(guideRows[0]);
    } catch (error) {
        console.error("Error fetching park guide information:", error);
        return NextResponse.json(
            {
                error:
                    error.message || "Failed to fetch park guide information",
            },
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
