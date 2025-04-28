import { NextResponse, NextRequest } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    console.log("GET request received for /api/users/[id]");

    const { id } = await params; // Destructure `id` directly from `params`
    let connection;

    try {
        console.log(`Fetching user with ID ${id}`);
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM Users WHERE user_id = ?",
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                {
                    status: 404,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                }
            );
        }

        console.log(`User with ID ${id} fetched successfully`);
        return NextResponse.json(rows[0], {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch user with ID ${id}` },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
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

// OPTIONS method remains the same
export async function OPTIONS(request) {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        }
    );
}
