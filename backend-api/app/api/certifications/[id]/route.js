// app/api/certifications/user/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

export async function GET(request, { params }) {
    let connection;
    try {
        // Get the authenticated user and validate role
        await assertUser(request, ["admin", "park_guide"]);

        // Get the guide ID from the URL parameter
        const id = params.id;
        if (!id) {
            return NextResponse.json(
                { error: "Guide ID is required" },
                { status: 400 }
            );
        }

        connection = await getConnection();
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
            [id]
        );

        // If no rows are returned, return an empty array instead of a 404
        return NextResponse.json(rows.length > 0 ? rows : []);
    } catch (error) {
        console.error("Error fetching guide certifications:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch guide certifications" },
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
