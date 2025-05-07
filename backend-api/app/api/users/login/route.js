import pool from "@/lib/db";
import admin from "@/lib/firebaseAdmin";

const allowedOrigin = "*";

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function GET(request) {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Content-Type": "application/json",
            },
        });
    }

    let connection;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT role, status FROM users WHERE uid = ?",
            [uid]
        );

        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Content-Type": "application/json",
                },
            });
        }

        // ✅ Reset login attempt tracking on successful login
        await connection.execute(
            `UPDATE users 
       SET failed_attempts = 0, last_failed_attempt = NULL, locked_until = NULL 
       WHERE uid = ?`,
            [uid]
        );

        return new Response(
            JSON.stringify({
                role: rows[0].role,
                status: rows[0].status,
            }),
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Error verifying token or querying DB:", error);
        return new Response(
            JSON.stringify({ message: "Internal server error" }),
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Content-Type": "application/json",
                },
            }
        );
    } finally {
        if (connection) connection.release();
    }
}
