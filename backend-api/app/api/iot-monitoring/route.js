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
    let connection;
    try {
        const body = await request.json();
        const { park_id, sensor_type, recorded_value } = body;

        connection = await getConnection();

        // Begin transaction
        await connection.beginTransaction();

        // Insert the IoT monitoring data
        const [result] = await connection.execute(
            "INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value) VALUES (?, ?, ?)",
            [park_id, sensor_type, recorded_value]
        );

        // Check if this data triggers any alert thresholds
        await checkThresholds(connection, park_id, sensor_type, recorded_value);

        // Commit the transaction
        await connection.commit();

        return NextResponse.json(
            {
                id: result.insertId,
                message: "IoT monitoring data created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating IoT monitoring data:", error);

        // Rollback on error
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Error rolling back transaction:", rollbackError);
            }
        }

        return NextResponse.json(
            { error: "Failed to create IoT monitoring data" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// Helper function to check thresholds and create alerts
async function checkThresholds(
    connection,
    park_id,
    sensor_type,
    recorded_value
) {
    try {
        // Get the applicable thresholds for this sensor and park
        const [thresholds] = await connection.execute(
            "SELECT * FROM AlertThresholds WHERE park_id = ? AND sensor_type = ? AND is_enabled = TRUE",
            [park_id, sensor_type]
        );

        if (thresholds.length === 0) {
            return; // No thresholds defined for this sensor
        }

        const threshold = thresholds[0];

        // Convert recorded value to number for comparison (if possible)
        let numericValue = parseFloat(recorded_value.replace(/[^\d.-]/g, ""));

        let thresholdTriggered = false;

        // Check if the value is outside the permitted range
        if (sensor_type === "motion") {
            // For motion sensor, alert on detection
            if (recorded_value.toLowerCase() === "detected") {
                thresholdTriggered = true;
            }
        } else if (!isNaN(numericValue)) {
            // For numeric sensors, check min/max thresholds
            if (
                (threshold.min_threshold !== null &&
                    numericValue < threshold.min_threshold) ||
                (threshold.max_threshold !== null &&
                    numericValue > threshold.max_threshold)
            ) {
                thresholdTriggered = true;
            }
        }

        // If a threshold was triggered, create an alert
        if (thresholdTriggered) {
            // First check if there's already an active alert for this sensor/park
            const [existingAlerts] = await connection.execute(
                "SELECT * FROM ActiveAlerts WHERE park_id = ? AND sensor_type = ? AND is_acknowledged = FALSE",
                [park_id, sensor_type]
            );

            if (existingAlerts.length === 0) {
                // No existing alert, create a new one
                await connection.execute(
                    `
                    INSERT INTO ActiveAlerts 
                    (park_id, sensor_type, recorded_value, threshold_id, message, severity)
                    VALUES (?, ?, ?, ?, ?, ?)
                `,
                    [
                        park_id,
                        sensor_type,
                        recorded_value,
                        threshold.threshold_id,
                        threshold.trigger_message,
                        threshold.severity,
                    ]
                );

                console.log(
                    `Created new alert for ${sensor_type} in park ${park_id}`
                );
            } else {
                // Just update the existing alert's value
                await connection.execute(
                    `
                    UPDATE ActiveAlerts
                    SET recorded_value = ?, created_at = CURRENT_TIMESTAMP
                    WHERE alert_id = ?
                `,
                    [recorded_value, existingAlerts[0].alert_id]
                );

                console.log(
                    `Updated existing alert for ${sensor_type} in park ${park_id}`
                );
            }
        }
    } catch (error) {
        console.error("Error checking thresholds:", error);
        throw error; // Propagate error to trigger transaction rollback
    }
}
