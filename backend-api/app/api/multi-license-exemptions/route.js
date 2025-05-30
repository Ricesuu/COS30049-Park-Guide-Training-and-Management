// app/api/multi-license-exemptions/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM MultiLicenseTrainingExemptions"
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error(
            "Error fetching multi-license training exemptions:",
            error
        );
        return NextResponse.json(
            { error: "Failed to fetch multi-license training exemptions" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { guide_id, training_id, exempted_training_id } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO MultiLicenseTrainingExemptions (guide_id, training_id, exempted_training_id) VALUES (?, ?, ?)",
            [guide_id, training_id, exempted_training_id]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message:
                    "Multi-license training exemption created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Error creating multi-license training exemption:",
            error
        );
        return NextResponse.json(
            { error: "Failed to create multi-license training exemption" },
            { status: 500 }
        );
    }
}
