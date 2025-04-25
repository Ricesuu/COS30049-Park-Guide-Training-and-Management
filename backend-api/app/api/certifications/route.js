// app/api/certifications/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT * FROM Certifications");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching certifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch certifications" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { guide_id, module_id, issued_date, expiry_date } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO Certifications (guide_id, module_id, issued_date, expiry_date) VALUES (?, ?, ?, ?)",
            [guide_id, module_id, issued_date, expiry_date]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message: "Certification created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating certification:", error);
        return NextResponse.json(
            { error: "Failed to create certification" },
            { status: 500 }
        );
    }
}
