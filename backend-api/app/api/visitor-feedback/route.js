// app/api/visitor-feedback/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM VisitorFeedback"
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching visitor feedback:", error);
        return NextResponse.json(
            { error: "Failed to fetch visitor feedback" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { visitor_id, guide_id, rating, comment } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO VisitorFeedback (visitor_id, guide_id, rating, comment) VALUES (?, ?, ?, ?)",
            [visitor_id, guide_id, rating, comment]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message: "Visitor feedback submitted successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting visitor feedback:", error);
        return NextResponse.json(
            { error: "Failed to submit visitor feedback" },
            { status: 500 }
        );
    }
}
