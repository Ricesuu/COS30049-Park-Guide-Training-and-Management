import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

export async function GET(request, context) {
    const params = await context.params;
    const { uid } = params; // ✅ Firebase UID from route param
    let connection;

    try {
        // ✅ Step 1: Authenticate user and check role
        const { uid: requesterUid, role } = await assertUser(request, [
            "admin",
            "park_guide",
        ]);

        // ✅ Step 2: Only allow if user is self or admin
        if (requesterUid !== uid && role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // ✅ Step 3: Fetch user from DB using UID
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE uid = ?",
            [uid]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("User fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release?.();
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    );
}
