import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

export async function POST(request) {
    let connection;
    try {
        // Verify user authentication and get user data
        const user = await assertUser(request);

        const { guide_id, requested_park_id } = await request.json();

        if (!guide_id || !requested_park_id) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Convert to integers to ensure proper type handling
        const guideid = parseInt(guide_id, 10);
        const parkid = parseInt(requested_park_id, 10);

        if (isNaN(guideid) || isNaN(parkid)) {
            return NextResponse.json(
                { error: "Invalid guide_id or park_id format" },
                { status: 400 }
            );
        }

        connection = await getConnection();

        // Update the park guide's certification status to 'pending'
        await connection.execute(
            `UPDATE ParkGuides 
             SET certification_status = 'pending',
                 requested_park_id = ?
             WHERE guide_id = ?`,
            [parkid, guideid]
        );

        return NextResponse.json({
            message: "License approval request submitted successfully",
        });
    } catch (error) {
        console.error("Error submitting license approval request:", error);
        return NextResponse.json(
            { error: "Failed to submit license approval request" },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
