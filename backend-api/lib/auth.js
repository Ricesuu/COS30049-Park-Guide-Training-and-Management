// lib/auth.js
import admin from "./firebaseAdmin";
import pool from "./db";

/**
 * Authenticates the user using Firebase ID token and returns user information
 * without enforcing specific role requirements.
 *
 * @param {Request} request - The incoming request (must include Authorization header).
 * @returns {Promise<{isAuthenticated: boolean, user: {id: string, uid: string, role: string}|null}>}
 */
export async function getAuth(request) {
    try {
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return { isAuthenticated: false, user: null };
        }

        // Verify token with Firebase
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid;

        // Get user from database
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.execute(
                `SELECT user_id, uid, role, status FROM Users WHERE uid = ?`,
                [uid]
            );

            if (users.length === 0) {
                return { isAuthenticated: false, user: null };
            }

            const user = users[0];

            // If user is not approved, consider not authenticated
            if (user.status !== "approved") {
                return { isAuthenticated: false, user: null };
            }

            return {
                isAuthenticated: true,
                user: {
                    id: user.user_id,
                    uid: user.uid,
                    role: user.role,
                },
            };
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return { isAuthenticated: false, user: null };
    }
}

/**
 * A simplified version of assertUser that can be used when you only need to check
 * if the user is authenticated without enforcing specific roles
 *
 * @param {Request} request - The incoming request
 * @returns {Promise<{id: string, uid: string, role: string}>}
 * @throws {Error} - Throws with status and message if unauthorized
 */
export async function requireAuth(request) {
    const auth = await getAuth(request);

    if (!auth.isAuthenticated || !auth.user) {
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error;
    }

    return auth.user;
}
