// app/api/guide-training-progress/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM GuideTrainingProgress"
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching guide training progress:", error);
        return NextResponse.json(
            { error: "Failed to fetch guide training progress" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { guide_id, module_id, status, completion_date } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO GuideTrainingProgress (guide_id, module_id, status, completion_date) VALUES (?, ?, ?, ?)",
            [guide_id, module_id, status, completion_date]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message: "Guide training progress created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating guide training progress:", error);
        return NextResponse.json(
            { error: "Failed to create guide training progress" },
            { status: 500 }
        );
    }
}
