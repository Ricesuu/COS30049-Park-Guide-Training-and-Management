import pool from "@/lib/db";

const allowedOrigin = "*";
const MAX_ATTEMPTS = 3;

export async function POST(req) {
    const { email } = await req.json();

    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Content-Type": "application/json",
            },
        });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute(
            `SELECT failed_attempts, locked_until, status FROM users WHERE email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Content-Type": "application/json",
                },
            });
        }

        const { failed_attempts, locked_until, status } = rows[0];
        const now = new Date();

        // ✅ Auto-reset if lock has expired
        if (locked_until && new Date(locked_until) <= now) {
            await connection.execute(
                `UPDATE users SET failed_attempts = 0, last_failed_attempt = NULL, locked_until = NULL WHERE email = ?`,
                [email]
            );
        }

        // ❌ Still locked
        if (locked_until && new Date(locked_until) > now) {
            return new Response(
                JSON.stringify({
                    allowed: false,
                    lockedUntil: new Date(locked_until).toISOString(),
                    error: "Too many login attempts. Please try again later.",
                }),
                {
                    status: 429,
                    headers: {
                        "Access-Control-Allow-Origin": allowedOrigin,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // ❌ Block login if not approved
        if (status !== "approved") {
            return new Response(
                JSON.stringify({
                    allowed: false,
                    error:
                        status === "pending"
                            ? "Your account is pending approval."
                            : "Your account has been rejected.",
                }),
                {
                    status: 403,
                    headers: {
                        "Access-Control-Allow-Origin": allowedOrigin,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // ✅ Login allowed
        return new Response(
            JSON.stringify({
                allowed: true,
                remainingAttempts: MAX_ATTEMPTS - failed_attempts, // Optional, for frontend display
            }),
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (err) {
        console.error("check-login-attempts error:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
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

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
