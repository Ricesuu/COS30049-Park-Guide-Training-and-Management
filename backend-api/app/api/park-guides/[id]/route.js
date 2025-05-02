import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function PUT(request, { params }) {
    console.log("PUT request received for /api/park-guides/[id]");
    const { id } = params;
    let connection;

    try {
        // Parse the request body
        const body = await request.json();
        console.log(`Updating park guide ${id} with:`, JSON.stringify(body));

        // Validate the input
        if (!body.assigned_park) {
            return NextResponse.json(
                { error: "Missing required field: assigned_park" },
                { status: 400 }
            );
        }

        const parkValue = body.assigned_park;

        connection = await getConnection();

        // Use a parameterized query to prevent SQL injection
        const [result] = await connection.execute(
            "UPDATE ParkGuides SET assigned_park = ? WHERE guide_id = ?",
            [parkValue, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Park guide not found or no changes made" },
                { status: 404 }
            );
        }

        console.log(
            `Park guide with ID ${id} updated successfully. Rows affected: ${result.affectedRows}`
        );
        return NextResponse.json(
            {
                message: `Park guide with ID ${id} updated successfully`,
                affectedRows: result.affectedRows,
            },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            }
        );
    } catch (error) {
        console.error(`Error updating park guide with ID ${id}:`, error);
        return NextResponse.json(
            {
                error: `Failed to update park guide with ID ${id}`,
                details: error.message,
            },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            }
        );
    } finally {
        if (connection) {
            if (connection.release) {
                connection.release();
            } else {
                connection.end();
            }
        }
    }
}
