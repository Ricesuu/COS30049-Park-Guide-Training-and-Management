// app/api/certifications/user/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

export async function GET(request) {
    let connection;
    try {
        // Get the authenticated user and validate role
        const { uid } = await assertUser(request, ["admin", "park_guide"]);

        connection = await getConnection();

        // First get the user's guide_id from the ParkGuides table
        const [guides] = await connection.execute(
            `
            SELECT g.guide_id 
            FROM Users u
            JOIN ParkGuides g ON u.user_id = g.user_id
            WHERE u.uid = ?
        `,
            [uid]
        );

        if (guides.length === 0) {
            return NextResponse.json([]);
        }

        const guideId = guides[0].guide_id;

        // Now fetch certifications with module info
        const [rows] = await connection.execute(
            `
            SELECT 
                c.cert_id,
                c.module_id,
                c.issued_date,
                c.expiry_date,
                tm.module_name,
                tm.description,
                tm.is_compulsory
            FROM 
                Certifications c
            JOIN 
                TrainingModules tm ON c.module_id = tm.module_id
            WHERE 
                c.guide_id = ?
            ORDER BY 
                c.issued_date DESC
        `,
            [guideId]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching user certifications:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch user certifications" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
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
