import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
import admin from "@/lib/firebaseAdmin";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;

    try {
        connection = await getConnection();

        const [rows] = await connection.execute(
            `SELECT pg.guide_id, pg.user_id, pg.certification_status, pg.license_expiry_date, 
                    pg.assigned_park, u.first_name, u.last_name, u.email, u.status as user_status
             FROM ParkGuides pg
             JOIN Users u ON pg.user_id = u.user_id
             WHERE pg.guide_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Guide not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0], {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error fetching guide:", error);
        return NextResponse.json(
            { error: "Failed to fetch guide" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}



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

        // If updating certification status, also update user status
        if (body.certification_status) {
            // First, get the user_id associated with this guide
            const [guideRows] = await connection.execute(
                "SELECT user_id FROM ParkGuides WHERE guide_id = ?",
                [id]
            );

            if (guideRows.length === 0) {
                return NextResponse.json(
                    { error: "Park guide not found" },
                    { status: 404 }
                );
            }

            const user_id = guideRows[0].user_id;

            // Begin transaction to update both tables
            await connection.beginTransaction();

            // Update ParkGuides table
            const [guideResult] = await connection.execute(
                "UPDATE ParkGuides SET certification_status = ? WHERE guide_id = ?",
                [body.certification_status, id]
            );

            // Map certification_status to user status
            let userStatus;
            if (body.certification_status === "certified") {
                userStatus = "approved";
            } else if (body.certification_status === "rejected") {
                userStatus = "rejected";
            } else {
                userStatus = "pending";
            }

            // Update Users table
            const [userResult] = await connection.execute(
                "UPDATE Users SET status = ? WHERE user_id = ?",
                [userStatus, user_id]
            );

            // Commit transaction
            await connection.commit();

            if (guideResult.affectedRows === 0) {
                return NextResponse.json(
                    { error: "Park guide not found or no changes made" },
                    { status: 404 }
                );
            }

            console.log(
                `Park guide with ID ${id} and associated user updated successfully.`
            );
            return NextResponse.json(
                {
                    message: `Park guide with ID ${id} updated successfully`,
                    affectedRows: guideResult.affectedRows,
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods":
                            "GET, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                }
            );
        } else {
            // Just updating assigned_park, no need to touch user status
            const [result] = await connection.execute(
                "UPDATE ParkGuides SET assigned_park = ? WHERE guide_id = ?",
                [body.assigned_park, id]
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
                        "Access-Control-Allow-Methods":
                            "GET, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                }
            );
        }
    } catch (error) {
        // Rollback transaction if there was an error
        if (connection && body.certification_status) {
            await connection.rollback();
        }

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
        console.log("Requesting connection from pool...");
        connection = await getConnection();
        console.log("Successfully acquired connection from pool");

        // Start transaction
        await connection.beginTransaction();
        console.log("Attempting to soft delete guide with ID:", id);

        // Get user information before soft deletion
        const [userInfo] = await connection.execute(
            "SELECT u.email, u.first_name, u.user_id, u.uid FROM Users u JOIN ParkGuides pg ON u.user_id = pg.user_id WHERE pg.guide_id = ?",
            [id]
        );

        if (userInfo.length === 0) {
            throw new Error("Guide not found");
        }
        const user = userInfo[0]; // Soft delete: Update Users table to deleted status
        await connection.execute(
            'UPDATE Users SET status = "deleted", deleted_at = CURRENT_TIMESTAMP WHERE user_id = ?',
            [user.user_id]
        );

        // Hard delete from ParkGuides table
        await connection.execute("DELETE FROM ParkGuides WHERE guide_id = ?", [
            id,
        ]);

        // Delete Firebase auth account (for security)
        try {
            await admin.auth().deleteUser(user.uid);
            console.log(`Firebase auth account deleted for UID: ${user.uid}`);
        } catch (firebaseError) {
            console.error("Firebase auth deletion error:", firebaseError);
            // Continue with the process even if Firebase deletion fails
        }

        // Send deletion notification email
        try {
            await sendEmail({
                to: user.email,
                template: "guideProfileDeletion",
                data: user.first_name,
            });
            console.log(`Deletion notification email sent to ${user.email}`);
        } catch (emailError) {
            console.error("Email sending error:", emailError);
        }

        // Commit the transaction
        await connection.commit();
        console.log("Successfully soft-deleted guide and related records");

        return NextResponse.json({
            message: "Guide deleted successfully",
            details:
                "Profile marked as deleted, Firebase account removed, and notification email sent",
        });
    } catch (error) {
        console.error("Delete operation failed:", error);
        if (connection) {
            await connection.rollback();
        }
        return NextResponse.json(
            { error: "Failed to delete guide", details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
            console.log("Database connection released");
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
