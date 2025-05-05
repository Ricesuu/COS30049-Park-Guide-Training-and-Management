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

        // ✅ Validate required fields (token is optional for mobile)
        if (!uid || !email || !firstName || !lastName || !role) {
            return NextResponse.json(
                { message: "Missing fields" },
                { status: 400 }
            );
        }

        // ✅ Only verify reCAPTCHA if token is present
        if (token) {
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
            if (!verifyData.success || verifyData.score < 0.5) {
                return NextResponse.json(
                    { message: "reCAPTCHA verification failed" },
                    { status: 403 }
                );
            }
        }

        // ✅ Insert user into database
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                `INSERT INTO users 
         (uid, email, first_name, last_name, role, status, failed_attempts, last_failed_attempt, locked_until, created_at)
         VALUES (?, ?, ?, ?, ?, 'pending', 0, NULL, NULL, NOW())`,
                [uid, email, firstName, lastName, role]
            );
        } finally {
            connection.release();
        }

        return new NextResponse(
            JSON.stringify({ message: "User registered successfully" }),
            {
                status: 201,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                },
            }
        );
    } catch (err) {
        console.error("Register API error:", err);
        return new NextResponse(JSON.stringify({ message: "Server error" }), {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
            },
        });
    }
}
