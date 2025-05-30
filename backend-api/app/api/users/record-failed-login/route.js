import pool from "@/lib/db";

const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 5;
const allowedOrigin = "*";

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

        // 🚫 Don't track if user is not approved
        if (status !== "approved") {
            return new Response(
                JSON.stringify({
                    error: "Login not permitted for this account status.",
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

        // 🛑 Skip updating if currently locked
        if (locked_until && new Date(locked_until) > now) {
            return new Response(
                JSON.stringify({
                    error: "Account is currently locked.",
                    lockedUntil: locked_until,
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

        const nextFailed = Math.min(failed_attempts + 1, MAX_ATTEMPTS);

        // ⏰ Lock user if threshold is hit
        const lockTriggered = nextFailed >= MAX_ATTEMPTS;
        const newLockedUntil = lockTriggered
            ? new Date(now.getTime() + LOCK_MINUTES * 60 * 1000)
            : null;

        await connection.execute(
            `UPDATE users
       SET failed_attempts = ?,
           last_failed_attempt = NOW(),
           locked_until = ?
       WHERE email = ?`,
            [nextFailed, newLockedUntil, email]
        );

        return new Response(
            JSON.stringify({
                success: true,
                remainingAttempts: MAX_ATTEMPTS - nextFailed,
                lockedUntil: newLockedUntil,
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
        console.error("record-failed-login error:", err);
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
