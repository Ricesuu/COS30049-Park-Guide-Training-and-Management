import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// Get all active alerts
export async function GET(request) {
    let connection;
    try {
        connection = await getConnection();

        // Extract park parameter from URL
        const { searchParams } = new URL(request.url);
        const parkId = searchParams.get("park");

        console.log(`[ActiveAlerts GET] Filtering by park: ${parkId || "all"}`);

        let query = `
            SELECT aa.*, p.park_name 
            FROM ActiveAlerts aa
            JOIN Parks p ON aa.park_id = p.park_id
        `;

        let params = [];

        // Filter by park if specified
        if (parkId && parkId !== "all") {
            query += " WHERE aa.park_id = ?";
            params.push(parkId);
        }

        query += " ORDER BY aa.created_at DESC";

        const [rows] = await connection.execute(query, params);
        console.log(`[ActiveAlerts GET] Retrieved ${rows.length} alerts`);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching active alerts:", error);
        return NextResponse.json(
            { error: "Failed to fetch active alerts" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Acknowledge an alert
export async function PUT(request) {
    let connection;
    try {
        const { alert_id } = await request.json();

        connection = await getConnection();

        const [result] = await connection.execute(
            `
            UPDATE ActiveAlerts
            SET is_acknowledged = TRUE
            WHERE alert_id = ?
        `,
            [alert_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Alert not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Alert with ID ${alert_id} acknowledged successfully`,
        });
    } catch (error) {
        console.error("Error acknowledging alert:", error);
        return NextResponse.json(
            { error: "Failed to acknowledge alert" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Delete (dismiss) an alert
export async function DELETE(request) {
    let connection;
    try {
        const { alert_id } = await request.json();

        connection = await getConnection();

        const [result] = await connection.execute(
            `
            DELETE FROM ActiveAlerts
            WHERE alert_id = ?
        `,
            [alert_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Alert not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `Alert with ID ${alert_id} dismissed successfully`,
        });
    } catch (error) {
        console.error("Error dismissing alert:", error);
        return NextResponse.json(
            { error: "Failed to dismiss alert" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
