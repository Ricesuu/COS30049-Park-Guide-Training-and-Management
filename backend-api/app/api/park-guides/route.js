// app/api/park-guides/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT * FROM ParkGuides");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching park guides:", error);
        return NextResponse.json(
            { error: "Failed to fetch park guides" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            user_id,
            certification_status,
            license_expiry_date,
            assigned_park,
        } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO ParkGuides (user_id, certification_status, license_expiry_date, assigned_park) VALUES (?, ?, ?, ?)",
            [user_id, certification_status, license_expiry_date, assigned_park]
        );
        return NextResponse.json(
            { id: result.insertId, message: "Park guide created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating park guide:", error);
        return NextResponse.json(
            { error: "Failed to create park guide" },
            { status: 500 }
        );
    }
}
