// app/api/certifications/user/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET(request) {
    let connection;
    try {
        // Get the authenticated user ID
        const auth = await getAuth(request);
        if (!auth.isAuthenticated) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = auth.user.id;
        
        connection = await getConnection();
        const [rows] = await connection.execute(`
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
        `, [userId]);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching user certifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch user certifications" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
