import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    // <--- Changed function signature
    console.log("GET request received for /api/park-guides/[id]");

    const { id } = params;
    let connection;

    try {
        console.log(`Fetching park guide with ID ${id}`);
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM ParkGuides WHERE guide_id = ?",
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Park guide not found" },
                {
                    status: 404,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                }
            );
        }

        console.log(`Park guide with ID ${id} fetched successfully`);
        return NextResponse.json(rows[0], {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        console.error(`Error fetching park guide with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch park guide with ID ${id}` },
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

// Add PUT method for updating certification_status
export async function PUT(request, { params }) {
    // <--- Changed function signature
    console.log("PUT request received for /api/park-guides/[id]");

    const { id } = params; // <--- Access id from the destructured params object
    let connection;

    try {
        const body = await request.json();
        const { certification_status } = body;

        console.log(
            `Updating park guide ${id} with status: ${certification_status}`
        );

        connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE ParkGuides SET certification_status = ? WHERE guide_id = ?",
            [certification_status, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Park guide not found or no changes made" },
                {
                    status: 404,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                }
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

// OPTIONS method remains the same
