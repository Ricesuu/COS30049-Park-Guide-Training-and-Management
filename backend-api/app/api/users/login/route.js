import pool from "@/lib/db";
import admin from "@/lib/firebaseAdmin";

const allowedOrigin = "*";

// Debug headers function
function logRequestDetails(request, context = "Request Info") {
    console.log(`==== LOGIN ENDPOINT ${context} ====`);
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);
    console.log("Headers:", Object.fromEntries([...request.headers.entries()]));
    console.log("================================");
}

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
    // Log incoming request
    logRequestDetails(request, "INCOMING");

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    console.log("Auth token present:", !!token);

    if (!token) {
        console.log("LOGIN FAILED: No authorization token provided");
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
        console.log("Attempting to verify Firebase token...");
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        console.log("Token verified successfully for UID:", uid);

        console.log("Connecting to database...");
        connection = await pool.getConnection();
        console.log("Database connection established");

        console.log("Querying user role and status...");
        const [rows] = await connection.execute(
            "SELECT role, status FROM users WHERE uid = ?",
            [uid]
        );

        if (rows.length === 0) {
            console.log("LOGIN FAILED: User not found in database");
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Content-Type": "application/json",
                },
            });
        }

        console.log("User found:", {
            uid,
            role: rows[0].role,
            status: rows[0].status,
        });

        // ✅ Reset login attempt tracking on successful login
        console.log("Resetting failed login attempts...");
        await connection.execute(
            `UPDATE users 
       SET failed_attempts = 0, last_failed_attempt = NULL, locked_until = NULL 
       WHERE uid = ?`,
            [uid]
        );
        console.log("Login attempts reset successful");

        console.log("LOGIN SUCCESS - Returning user data");
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
                    // Add additional CORS headers to ensure browser compatibility
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Expose-Headers": "Content-Length, X-JSON",
                },
            }
        );
    } catch (error) {
        console.error("==== LOGIN ERROR DETAILS ====");
        console.error("Error type:", error.name);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Error stack:", error.stack);
        console.error("==============================");

        return new Response(
            JSON.stringify({
                message: "Internal server error",
                errorType: error.name,
                errorCode: error.code || "unknown",
            }),
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Content-Type": "application/json",
                    // Add additional CORS headers to ensure browser compatibility
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Expose-Headers": "Content-Length, X-JSON",
                },
            }
        );
    } finally {
        if (connection) {
            console.log("Releasing database connection...");
            connection.release();
            console.log("Database connection released");
        }
    }
}
