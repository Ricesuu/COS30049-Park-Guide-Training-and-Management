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

        // Check for required fields - allow either certification_status or assigned_park
        if (!body.certification_status && !body.assigned_park) {
            return NextResponse.json(
                {
                    error: "Missing required fields: either certification_status or assigned_park",
                },
                { status: 400 }
            );
        }

        connection = await getConnection();
        let query, params;

        // Determine which field to update based on what was provided
        if (body.certification_status) {
            query =
                "UPDATE ParkGuides SET certification_status = ? WHERE guide_id = ?";
            params = [body.certification_status, id];
        } else {
            query =
                "UPDATE ParkGuides SET assigned_park = ? WHERE guide_id = ?";
            params = [body.assigned_park, id];
        }

        // Execute the update query
        const [result] = await connection.execute(query, params);

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
                    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
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
                    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
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

export async function DELETE(request, { params }) {
    const { id } = params;
    console.log(`--- [DEBUG] DELETE Handler Reached for ID: ${id} ---`);

    let connection;
    try {
        connection = await getConnection();
        console.log(
            `Attempting to delete guide with ID: ${id} and related records`
        );

        // Start a transaction (optional but recommended for multiple deletes)
        // await connection.beginTransaction(); // Uncomment if using transactions

        // Delete related records first due to foreign key constraints
        console.log(`Deleting related records for guide ID: ${id}`);

        // Delete from VisitorFeedback
        await connection.execute(
            "DELETE FROM VisitorFeedback WHERE guide_id = ?",
            [id]
        );
        console.log(`Deleted from VisitorFeedback for guide ID: ${id}`);

        // Delete from Certifications
        await connection.execute(
            "DELETE FROM Certifications WHERE guide_id = ?",
            [id]
        );
        console.log(`Deleted from Certifications for guide ID: ${id}`);

        // Delete from MultiLicenseTrainingExemptions
        await connection.execute(
            "DELETE FROM MultiLicenseTrainingExemptions WHERE guide_id = ?",
            [id]
        );
        console.log(
            `Deleted from MultiLicenseTrainingExemptions for guide ID: ${id}`
        );

        // Delete from GuideTrainingProgress
        await connection.execute(
            "DELETE FROM GuideTrainingProgress WHERE guide_id = ?",
            [id]
        );
        console.log(`Deleted from GuideTrainingProgress for guide ID: ${id}`);

        // Now, delete the guide itself
        console.log(`Deleting guide from ParkGuides for ID: ${id}`);
        const [result] = await connection.execute(
            "DELETE FROM ParkGuides WHERE guide_id = ?",
            [id]
        );

        console.log(`Delete operation result from ParkGuides:`, result);

        if (result.affectedRows === 0) {
            // If the guide wasn't found after attempting to delete related records
            // await connection.rollback(); // Uncomment if using transactions
            return NextResponse.json(
                {
                    error: "Guide not found or delete failed after clearing related records",
                },
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // Commit the transaction (optional but recommended)
        // await connection.commit(); // Uncomment if using transactions

        // Return success response
        return NextResponse.json(
            {
                message: "Guide and related records deleted successfully",
                affectedRows: result.affectedRows,
            },
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } catch (error) {
        console.error("Delete operation failed:", error);
        // Rollback transaction on error (optional but recommended)
        // if (connection) await connection.rollback(); // Uncomment if using transactions

        return NextResponse.json(
            { error: "Failed to delete guide", details: error.message },
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } finally {
        if (connection) {
            try {
                await connection.release();
                console.log("Database connection released");
            } catch (err) {
                console.error("Error releasing connection:", err);
            }
        }
    }
}

// Ensure OPTIONS handler is still present and correct
export async function OPTIONS(request) {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
