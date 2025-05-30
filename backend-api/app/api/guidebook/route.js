// app/api/guidebook/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT * FROM Guidebook");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching guidebook entries:", error);
        return NextResponse.json(
            { error: "Failed to fetch guidebook entries" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { park_id, title, content, multimedia_links } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO Guidebook (park_id, title, content, multimedia_links) VALUES (?, ?, ?, ?)",
            [park_id, title, content, multimedia_links]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message: "Guidebook entry created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating guidebook entry:", error);
        return NextResponse.json(
            { error: "Failed to create guidebook entry" },
            { status: 500 }
        );
    }
}
