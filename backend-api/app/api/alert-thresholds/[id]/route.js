import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// Get a single alert threshold
export async function GET(request, { params }) {
    const { id } = params;
    let connection;

    try {
        connection = await getConnection();

        const [rows] = await connection.execute(
            `
            SELECT at.*, p.park_name 
            FROM AlertThresholds at
            JOIN Parks p ON at.park_id = p.park_id
            WHERE at.threshold_id = ?
        `,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Alert threshold not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching alert threshold with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch alert threshold with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Update an alert threshold
export async function PUT(request, { params }) {
    const { id } = params;
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
            UPDATE AlertThresholds
            SET park_id = ?,
                sensor_type = ?,
                min_threshold = ?,
                max_threshold = ?,
                trigger_message = ?,
                severity = ?,
                is_enabled = ?
            WHERE threshold_id = ?
        `,
            [
                park_id,
                sensor_type,
                min_threshold,
                max_threshold,
                trigger_message,
                severity,
                is_enabled,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Alert threshold not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Alert threshold with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating alert threshold with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update alert threshold with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Delete an alert threshold
export async function DELETE(request, { params }) {
    const { id } = params;
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.execute(
            "DELETE FROM AlertThresholds WHERE threshold_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Alert threshold not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Alert threshold with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting alert threshold with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete alert threshold with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
