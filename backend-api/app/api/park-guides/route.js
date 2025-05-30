import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { sendEmail } from "@/lib/emailService";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        // Fetch all park guides with user information using JOIN
        const [rows] = await connection.execute(
            `SELECT pg.guide_id, pg.user_id, pg.certification_status, pg.license_expiry_date, pg.assigned_park, 
                    u.first_name, u.last_name, u.email, u.status as user_status
             FROM ParkGuides pg
             JOIN Users u ON pg.user_id = u.user_id`
        );
        return NextResponse.json(rows, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching park guides:", error);
        return NextResponse.json(
            { error: "Failed to fetch park guides" },
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const {
            user_id,
            certification_status,
            license_expiry_date,
            assigned_park,
        } = body;

        if (
            !user_id ||
            !certification_status ||
            !license_expiry_date ||
            !assigned_park
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        connection = await getConnection();

        // Get user and park information for the email
        const [userRows] = await connection.execute(
            "SELECT email, first_name FROM users WHERE id = ?",
            [user_id]
        );

        const [parkRows] = await connection.execute(
            "SELECT park_name FROM parks WHERE id = ?",
            [assigned_park]
        );

        const user = userRows[0];
        const park = parkRows[0];

        // Insert or update park guide record
        await connection.execute(
            `INSERT INTO ParkGuides 
             (user_id, certification_status, license_expiry_date, assigned_park)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             certification_status = ?,
             license_expiry_date = ?,
             assigned_park = ?`,
            [
                user_id,
                certification_status,
                license_expiry_date,
                assigned_park,
                certification_status,
                license_expiry_date,
                assigned_park,
            ]
        );

        // Send park assignment email
        if (user && park) {
            await sendEmail({
                to: user.email,
                template: "parkAssignment",
                data: {
                    firstName: user.first_name,
                    parkName: park.park_name,
                },
            });
        }

        return NextResponse.json(
            { message: "Park guide assigned successfully" },
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating/updating park guide:", error);
        return NextResponse.json(
            { error: "Failed to create/update park guide" },
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    } finally {
        if (connection) connection.release();
    }
}
