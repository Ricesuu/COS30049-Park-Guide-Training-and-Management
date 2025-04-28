// app/api/iot-monitoring/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM IoTMonitoring WHERE sensor_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "IoT monitoring data not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(
            `Error fetching IoT monitoring data with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to fetch IoT monitoring data with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    try {
        const body = await request.json();
        const { park_id, sensor_type, recorded_value } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE IoTMonitoring SET park_id = ?, sensor_type = ?, recorded_value = ? WHERE sensor_id = ?",
            [park_id, sensor_type, recorded_value, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "IoT monitoring data not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `IoT monitoring data with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(
            `Error updating IoT monitoring data with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to update IoT monitoring data with ID ${id}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [result] = await connection.execute(
            "DELETE FROM IoTMonitoring WHERE sensor_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "IoT monitoring data not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `IoT monitoring data with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(
            `Error deleting IoT monitoring data with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to delete IoT monitoring data with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
