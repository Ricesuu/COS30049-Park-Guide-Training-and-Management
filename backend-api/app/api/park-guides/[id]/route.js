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
            return NextResponse.json(
                { error: "Guide not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0], {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
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
        const body = await request.json();
        console.log(`Updating park guide ${id} with:`, JSON.stringify(body));

        if (!body.certification_status) {
            return NextResponse.json(
                { error: "certification_status is required" },
                { status: 400 }
            );
        }

        connection = await getConnection();

        // First, get user info for email notifications
        const [guideInfo] = await connection.execute(
            `SELECT pg.*, u.email, u.first_name, u.user_id, p.park_name
             FROM ParkGuides pg
             JOIN Users u ON pg.user_id = u.user_id
             LEFT JOIN Parks p ON pg.requested_park_id = p.park_id
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
        await connection.beginTransaction(); // Update certification status and handle park guide certification approval
        if (body.certification_status === "certified") {
            // Calculate expiry date (1 year from now)
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            const mysqlDateStr = expiryDate.toISOString().split("T")[0];

            // Update certification status, license expiry, assign requested park and clear request
            await connection.execute(
                `UPDATE ParkGuides 
                 SET certification_status = ?,
                     license_expiry_date = ?,
                     assigned_park = COALESCE(requested_park_id, assigned_park),
                     requested_park_id = NULL
                 WHERE guide_id = ?`,
                [body.certification_status, mysqlDateStr, id]
            );
        } else {
            await connection.execute(
                `UPDATE ParkGuides 
                 SET certification_status = ?
                 WHERE guide_id = ?`,
                [body.certification_status, id]
            );
        } // If certification is approved, send email notification
        if (body.certification_status === "certified") {
            // Send certification approval email
            await sendEmail({
                to: guide.email,
                template: "certificationApproved",
                data: {
                    firstName: guide.first_name,
                    parkName: guide.park_name, // Include park name in email if available
                },
            });
        }

        await connection.commit();

        return NextResponse.json({
            message: "Park guide updated successfully",
            guide: {
                ...guide,
                certification_status: body.certification_status,
            },
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Error updating park guide:", error);
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

export async function POST(request, { params }) {
    const { id } = params;
    let connection;

    try {
        const { action } = await request.json();

        if (action === "sendLicenseExpiryReminder") {
            connection = await getConnection();

            // Get guide information
            const [guideInfo] = await connection.execute(
                `SELECT pg.*, u.email, u.first_name, p.park_name
                 FROM ParkGuides pg
                 JOIN Users u ON pg.user_id = u.user_id
                 LEFT JOIN Parks p ON pg.assigned_park = p.park_id
                 WHERE pg.guide_id = ?`,
                [id]
            );

            if (guideInfo.length === 0) {
                return NextResponse.json(
                    { error: "Guide not found" },
                    { status: 404 }
                );
            }

            const guide = guideInfo[0];
            const expiryDate = new Date(guide.license_expiry_date);
            const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            // Send license expiry reminder email with firstName as direct value
            await sendEmail({
                to: guide.email,
                template: "licenseExpirationReminder",
                data: guide.first_name,
            });

            return NextResponse.json({
                message: "License expiry reminder sent successfully",
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error in park guide POST operation:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
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
