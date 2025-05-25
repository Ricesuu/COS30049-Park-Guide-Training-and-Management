import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
import admin from "@/lib/firebaseAdmin";

export async function PUT(request, { params }) {
    console.log("PUT request received for /api/park-guides/[id]");
    const { id } = params;
    let connection;

    try {
        // Parse the request body
        const body = await request.json();
        console.log(`Updating park guide ${id} with:`, JSON.stringify(body));

        if (!body.certification_status) {
            return NextResponse.json(
                { error: "Missing required field: certification_status" },
                { status: 400 }
            );
        }

        connection = await getConnection();

        // First, get user info for email notifications
        const [guideInfo] = await connection.execute(
            `SELECT pg.*, u.email, u.first_name, u.user_id
             FROM ParkGuides pg
             JOIN Users u ON pg.user_id = u.user_id
             WHERE pg.guide_id = ?`,
            [id]
        );

        if (guideInfo.length === 0) {
            return NextResponse.json(
                { error: "Park guide not found" },
                { status: 404 }
            );
        }

        const guide = guideInfo[0];

        // Begin transaction for multiple updates
        await connection.beginTransaction();

        try {
            if (body.certification_status === "certified") {
                // Set expiry date to one year from now
                const oneYearFromNow = new Date();
                oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
                const expiryDate = oneYearFromNow.toISOString().split("T")[0];

                // For approval: clear requested_park_id, update status to certified, set expiry date
                const [approvalResult] = await connection.execute(
                    `UPDATE ParkGuides 
                    SET certification_status = 'certified',
                        requested_park_id = NULL,
                        assigned_park = ?,
                        license_expiry_date = ?
                    WHERE guide_id = ?`,
                    [guide.requested_park_id, expiryDate, id]
                );

                // Update user status to approved
                await connection.execute(
                    "UPDATE Users SET status = 'approved' WHERE user_id = ?",
                    [guide.user_id]
                );

                // Send approval email
                await sendEmail({
                    to: guide.email,
                    template: "certificationApproved",
                    data: {
                        firstName: guide.first_name,
                        certificationName: "Park Guide",
                        expiryDate: expiryDate,
                    },
                });
            } else {
                // For other status changes (e.g. rejection)
                const [updateResult] = await connection.execute(
                    `UPDATE ParkGuides 
                    SET certification_status = ?,
                        requested_park_id = NULL
                    WHERE guide_id = ?`,
                    [body.certification_status, id]
                );

                // Update user status if rejected
                if (body.certification_status === "rejected") {
                    await connection.execute(
                        "UPDATE Users SET status = 'rejected' WHERE user_id = ?",
                        [guide.user_id]
                    );
                }
            }

            await connection.commit();

            return NextResponse.json({
                message: `Guide certification status updated successfully to ${body.certification_status}`,
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        console.error(`Error updating park guide ${id}:`, error);
        return NextResponse.json(
            { error: "Failed to update park guide" },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
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
