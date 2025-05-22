import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

export async function GET(request, context) {
    const params = await context.params;
    const { uid } = params; // ✅ Firebase UID from route param
    let connection;

    try {
        // ✅ Step 1: Authenticate user and check role
        const { uid: requesterUid, role } = await assertUser(request, [
            "admin",
            "park_guide",
        ]);

        // ✅ Step 2: Only allow if user is self or admin
        if (requesterUid !== uid && role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }        // ✅ Step 3: Fetch user from DB using UID
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM Users WHERE uid = ?",
            [uid]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("User fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release?.();
    }
}

export async function PUT(request, context) {
    const params = await context.params;
    const { uid } = params; // Firebase UID from route param
    let connection;

    try {
        // Step 1: Only admins can update user status
        //const { role: requesterRole } = await assertUser(request, ["admin"]);

        // Step 2: Parse the request body
        const body = await request.json();
        console.log(`Updating user ${uid} with:`, JSON.stringify(body));

        if (!body.status) {
            return NextResponse.json(
                { error: "Missing required field: status" },
                { status: 400 }
            );
        }

        connection = await getConnection();

        // Begin transaction for potential multi-table updates
        await connection.beginTransaction();

        try {
            // Step 3: Get current user data before update
            const [userRows] = await connection.execute(
                "SELECT * FROM Users WHERE uid = ?",
                [uid]
            );

            if (userRows.length === 0) {
                await connection.rollback();
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            const user = userRows[0];

            // Step 4: Update user status
            const [updateResult] = await connection.execute(
                "UPDATE Users SET status = ? WHERE uid = ?",
                [body.status, uid]
            );

            // Step 5: If user is approved and is a park guide, create park guide record
            if (body.status === "approved" && user.role === "park_guide") {
                console.log(
                    `User ${uid} approved as park guide - creating guide record`
                );

                // Check if park guide record already exists
                const [existingGuideRows] = await connection.execute(
                    "SELECT * FROM ParkGuides WHERE user_id = ?",
                    [user.user_id]
                );

                if (existingGuideRows.length === 0) {
                    // Set a default license expiry one year from now
                    const oneYearFromNow = new Date();
                    oneYearFromNow.setFullYear(
                        oneYearFromNow.getFullYear() + 1
                    );
                    const licenseExpiry = oneYearFromNow
                        .toISOString()
                        .split("T")[0]; // YYYY-MM-DD format

                    // Create park guide record with pending certification status
                    const [guideResult] = await connection.execute(
                        `INSERT INTO ParkGuides (user_id, certification_status, license_expiry_date, assigned_park)
                        VALUES (?, 'pending', ?, ?)`,
                        [
                            user.user_id,
                            licenseExpiry,
                            body.assigned_park || "Unassigned",
                        ]
                    );

                    console.log(
                        `Park guide record created with ID: ${guideResult.insertId}`
                    );
                }
            }

            // Commit all changes
            await connection.commit();

            return NextResponse.json({
                message: `User status updated to ${body.status}`,
                userUpdated: updateResult.affectedRows > 0,
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        console.error(`Error updating user ${uid}:`, error);
        return NextResponse.json(
            { error: error.message || "Failed to update user" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release?.();
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    );
}
