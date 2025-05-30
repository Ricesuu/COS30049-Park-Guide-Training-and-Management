import admin from "./firebaseAdmin";
import pool from "./db";

/**
 * Authenticates the user using Firebase ID token and validates role.
 *
 * @param {Request} req - The incoming request (must include Authorization header).
 * @param {string[]} allowedRoles - List of roles allowed to access the route.
 * @returns {Promise<{uid: string, role: string, status: string}>}
 * @throws {Error} - Throws with status and message if unauthorized or forbidden.
 */
export const assertUser = async (req, allowedRoles = []) => {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        const err = new Error("Missing authentication token");
        err.status = 401;
        throw err;
    }

    try {
        // 1. Verify token with Firebase
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid;

        // 2. Get user role + status from your MySQL DB
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `SELECT role, status FROM users WHERE uid = ?`,
            [uid]
        );
        connection.release();

        if (rows.length === 0) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }

        const { role, status } = rows[0];

        // 3. Check account approval
        if (status !== "approved") {
            const err = new Error("Account not approved");
            err.status = 403;
            throw err;
        }        // 4. Check if role is allowed (case-insensitive comparison)
        if (allowedRoles.length > 0) {
            const userRoleLower = role.toLowerCase().replace(/[_\s-]/g, '');
            const allowedRolesLower = allowedRoles.map((r) => r.toLowerCase().replace(/[_\s-]/g, ''));

            if (!allowedRolesLower.includes(userRoleLower)) {
                const err = new Error(
                    `Insufficient role permissions: ${role} is not in [${allowedRoles.join(
                        ", "
                    )}]`
                );
                err.status = 403;
                throw err;
            }
        }

        // ✅ Auth success
        return { uid, role, status };
    } catch (err) {
        if (!err.status) {
            err.status = 401;
            err.message = "Invalid or expired token";
        }
        throw err;
    }
};
