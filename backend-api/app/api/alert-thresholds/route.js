import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// Get all alert thresholds
export async function GET() {
    let connection;
    try {
        connection = await getConnection();

        // Join with Parks to include park names
        const [rows] = await connection.execute(`
            SELECT at.*, p.park_name 
            FROM AlertThresholds at
            JOIN Parks p ON at.park_id = p.park_id
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching alert thresholds:", error);
        return NextResponse.json(
            { error: "Failed to fetch alert thresholds" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Create a new alert threshold
export async function POST(request) {
    let connection;
    try {
        const {
            park_id,
            sensor_type,
            min_threshold,
            max_threshold,
            trigger_message,
            severity,
            is_enabled,
        } = await request.json();

        connection = await getConnection();

        const [result] = await connection.execute(
            `
            INSERT INTO AlertThresholds 
            (park_id, sensor_type, min_threshold, max_threshold, trigger_message, severity, is_enabled)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
            [
                park_id,
                sensor_type,
                min_threshold,
                max_threshold,
                trigger_message,
                severity || "medium",
                is_enabled !== undefined ? is_enabled : true,
            ]
        );

        return NextResponse.json(
            {
                id: result.insertId,
                message: "Alert threshold created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating alert threshold:", error);
        return NextResponse.json(
            { error: "Failed to create alert threshold" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
