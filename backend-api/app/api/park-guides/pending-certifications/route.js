import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
    let connection;
    try {
        connection = await getConnection();

        // Get park guides with pending certification status who have requested park assignments
        const [guides] = await connection.execute(`
            SELECT pg.*, u.first_name, u.last_name, u.email, p.park_name as requested_park_name
            FROM ParkGuides pg
            JOIN Users u ON pg.user_id = u.user_id
            LEFT JOIN Parks p ON pg.requested_park_id = p.park_id
            WHERE pg.certification_status = 'pending' 
            AND pg.requested_park_id IS NOT NULL
        `);

        if (guides.length === 0) {
            return NextResponse.json({
                message: "No pending certification requests found",
                guides: [],
            });
        }

        return NextResponse.json(guides);
    } catch (error) {
        console.error("Error fetching pending certifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch pending certifications" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    );
}
