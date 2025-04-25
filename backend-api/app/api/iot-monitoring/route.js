// app/api/iot-monitoring/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT * FROM IoTMonitoring");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching IoT monitoring data:", error);
        return NextResponse.json(
            { error: "Failed to fetch IoT monitoring data" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { park_id, sensor_type, recorded_value } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value) VALUES (?, ?, ?)",
            [park_id, sensor_type, recorded_value]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message: "IoT monitoring data created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating IoT monitoring data:", error);
        return NextResponse.json(
            { error: "Failed to create IoT monitoring data" },
            { status: 500 }
        );
    }
}
