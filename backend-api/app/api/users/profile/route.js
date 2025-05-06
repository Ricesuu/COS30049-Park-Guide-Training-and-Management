import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";
import admin from "@/lib/firebaseAdmin";

// GET profile data for the current authenticated user
export async function GET(request) {
    let connection;
    try {
        // Authenticate and ensure the user is an admin
        const { uid, role } = await assertUser(request, ["admin"]);

        // Get the user's profile data
        connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT user_id, email, first_name, last_name, role, status, created_at 
             FROM Users 
             WHERE uid = ?`,
            [uid]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "User profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch profile" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Update the user's profile information
export async function PUT(request) {
    let connection;
    try {
        // Authenticate and ensure the user is an admin
        const { uid, role } = await assertUser(request, ["admin"]);
        const body = await request.json();

        const { first_name, last_name } = body;

        // Validate required fields
        if (!first_name || !last_name) {
            return NextResponse.json(
                { error: "First name and last name are required" },
                { status: 400 }
            );
        }

        // Update the user's profile in the database
        connection = await getConnection();
        const [result] = await connection.execute(
            `UPDATE Users 
             SET first_name = ?, last_name = ?
             WHERE uid = ?`,
            [first_name, last_name, uid]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "User not found or no changes made" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            updated: {
                first_name,
                last_name,
            },
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update profile" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Options for handling CORS preflight requests
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    );
}
