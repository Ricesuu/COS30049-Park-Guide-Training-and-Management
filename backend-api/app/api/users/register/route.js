import { NextResponse } from "next/server";
import pool from "@/lib/db";

const allowedOrigin = "*";
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { uid, email, firstName, lastName, role, token } = body;

        // Add debug logging
        console.log("Registration request received:", {
            uid,
            email,
            firstName,
            lastName,
            role,
        });

        // ✅ Validate all required fields including token
        if (!uid || !email || !firstName || !lastName || !role || !token) {
            console.log("Missing required fields in registration");
            return NextResponse.json(
                { message: "Missing required fields or reCAPTCHA token" },
                { status: 400 }
            );
        }

        // ✅ Always verify reCAPTCHA token (required for all clients)
        const verifyRes = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
            }
        );

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
            console.log("reCAPTCHA verification failed");
            return NextResponse.json(
                { message: "reCAPTCHA verification failed" },
                { status: 403 }
            );
        }

        // ✅ Insert new user into the database - ONLY in Users table with pending status
        const connection = await pool.getConnection();

        try {
            console.log("Inserting new user with pending status");

            // Insert into Users table only
            const [userResult] = await connection.execute(
                `INSERT INTO Users 
                (uid, email, first_name, last_name, role, status, failed_attempts, last_failed_attempt, locked_until, created_at)
                VALUES (?, ?, ?, ?, ?, 'pending', 0, NULL, NULL, NOW())`,
                [uid, email, firstName, lastName, role]
            );

            console.log(
                `User inserted with ID: ${userResult.insertId} and pending status`
            );

            return new NextResponse(
                JSON.stringify({
                    message:
                        "User registered successfully. Pending admin approval.",
                    role: role,
                    status: "pending",
                }),
                {
                    status: 201,
                    headers: {
                        "Access-Control-Allow-Origin": allowedOrigin,
                    },
                }
            );
        } catch (err) {
            console.error("Database operation failed:", err);
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("Register API error:", err);
        return new NextResponse(
            JSON.stringify({
                message: "Server error",
                error: err.message,
            }),
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                },
            }
        );
    }
}
