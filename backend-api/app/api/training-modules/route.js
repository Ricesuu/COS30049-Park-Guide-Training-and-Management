// app/api/training-modules/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM TrainingModules"
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching training modules:", error);
        return NextResponse.json(
            { error: "Failed to fetch training modules" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { module_name, description, duration, price } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO TrainingModules (module_name, description, duration, price) VALUES (?, ?, ?, ?)",
            [module_name, description, duration, price || 0.0]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message: "Training module created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating training module:", error);
        return NextResponse.json(
            { error: "Failed to create training module" },
            { status: 500 }
        );
    }
}
