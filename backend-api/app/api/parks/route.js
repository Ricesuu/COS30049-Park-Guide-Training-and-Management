// app/api/parks/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT * FROM Parks");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching parks:", error);
        return NextResponse.json(
            { error: "Failed to fetch parks" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { park_name, location, description, wildlife } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO Parks (park_name, location, description, wildlife) VALUES (?, ?, ?, ?)",
            [park_name, location, description, wildlife]
        );
        return NextResponse.json(
            { id: result.insertId, message: "Park created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating park:", error);
        return NextResponse.json(
            { error: "Failed to create park" },
            { status: 500 }
        );
    }
}
