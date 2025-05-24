// app/api/certifications/user/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET(request, context) {
    let connection;
    try {
        // Get the authenticated user for authorization check
        const auth = await getAuth(request);
        if (!auth.isAuthenticated) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }        // Get the guide ID from the URL parameter
        const { id } = context.params;
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
                tm.description
            FROM 
                Certifications c
            JOIN 
                TrainingModules tm ON c.module_id = tm.module_id
            WHERE 
                c.guide_id = ?
            ORDER BY 
                c.issued_date DESC
        `,            [id]
        );

        // If no rows are returned, return an empty array instead of a 404
        return NextResponse.json(rows.length > 0 ? rows : []);
    } catch (error) {
        console.error("Error fetching guide certifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch guide certifications" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
