import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/emailService";

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

        // ✅ Validate all required fields including token
        if (!uid || !email || !firstName || !lastName || !role || !token) {
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
            return NextResponse.json(
                { message: "reCAPTCHA verification failed" },
                { status: 403 }
            );
        }

        // ✅ Insert new user into the database
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                `INSERT INTO users 
         (uid, email, first_Name, last_Name, role, status, failed_attempts, last_failed_attempt, locked_until, created_At)
         VALUES (?, ?, ?, ?, ?, 'pending', 0, NULL, NULL, NOW())`,
                [uid, email, firstName, lastName, role]
            );

            // Send welcome email
            await sendEmail({
                to: email,
                template: "guideRegistration",
                data: firstName,
            });

            return NextResponse.json(
                { message: "User registered successfully" },
                {
                    status: 201,
                    headers: {
                        "Access-Control-Allow-Origin": allowedOrigin,
                    },
                }
            );
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Registration failed" },
            { status: 500 }
        );
    }
}
