// app/api/iot-monitoring/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();

        console.log("[IoTMonitoring GET] Database connection established");

        const [rows] = await connection.execute("SELECT * FROM IoTMonitoring");

        console.log(`[IoTMonitoring GET] Retrieved ${rows.length} records`);

        return NextResponse.json(rows);
    } catch (error) {
        console.error(
            "[IoTMonitoring GET] Error fetching IoT monitoring data:",
            error
        );
        return NextResponse.json(
            { error: "Failed to fetch IoT monitoring data" },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
            console.log("[IoTMonitoring GET] Database connection released");
        }
    }
}

// POST request handler for creating new IoT monitoring data
export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const { park_id, sensor_type, recorded_value } = body;

        console.log("=================================================");
        console.log("[IoTMonitoring POST] Request received with data:", {
            park_id,
            sensor_type,
            recorded_value,
        });
        console.log("=================================================");

        connection = await getConnection();
        console.log("[IoTMonitoring POST] Database connection established");

        // Begin transaction
        await connection.beginTransaction();
        console.log("[IoTMonitoring POST] Database transaction started");

        // Insert the IoT monitoring data
        console.log(
            "[IoTMonitoring POST] Executing INSERT query with params:",
            [park_id, sensor_type, recorded_value]
        );
        const [result] = await connection.execute(
            "INSERT INTO IoTMonitoring (park_id, sensor_type, recorded_value) VALUES (?, ?, ?)",
            [park_id, sensor_type, recorded_value]
        );
        console.log(
            "[IoTMonitoring POST] INSERT successful, ID:",
            result.insertId
        );

        // Check if this data triggers any alert thresholds
        console.log("[IoTMonitoring POST] Checking thresholds for triggers");
        await checkThresholds(connection, park_id, sensor_type, recorded_value);
        console.log("[IoTMonitoring POST] Threshold checks completed");

        // Commit the transaction
        await connection.commit();
        console.log("[IoTMonitoring POST] Transaction committed successfully");

        return NextResponse.json(
            {
                id: result.insertId,
                message: "IoT monitoring data created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("=================================================");
        console.error(
            "[IoTMonitoring POST] Error creating IoT monitoring data:",
            error
        );
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack,
        });
        console.error("=================================================");

        // Rollback on error
        if (connection) {
            try {
                await connection.rollback();
                console.log(
                    "[IoTMonitoring POST] Transaction rolled back due to error"
                );
            } catch (rollbackError) {
                console.error(
                    "[IoTMonitoring POST] Error rolling back transaction:",
                    rollbackError
                );
            }
        }

        return NextResponse.json(
            { error: "Failed to create IoT monitoring data" },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
            console.log("[IoTMonitoring POST] Database connection released");
        }
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
        console.log("[checkThresholds] Looking for thresholds with params:", {
            park_id,
            sensor_type,
        });
        const [thresholds] = await connection.execute(
            "SELECT * FROM AlertThresholds WHERE park_id = ? AND sensor_type = ? AND is_enabled = TRUE",
            [park_id, sensor_type]
        );

        console.log(
            `[checkThresholds] Found ${thresholds.length} active thresholds for this sensor`
        );

        if (thresholds.length === 0) {
            console.log(
                "[checkThresholds] No thresholds defined for this sensor, skipping alert creation"
            );
            return; // No thresholds defined for this sensor
        }

        const threshold = thresholds[0];
        console.log("[checkThresholds] Threshold details:", {
            threshold_id: threshold.threshold_id,
            min_threshold: threshold.min_threshold,
            max_threshold: threshold.max_threshold,
            severity: threshold.severity,
            trigger_message: threshold.trigger_message,
        });

        // Convert recorded value to number for comparison (if possible)
        let numericValue = parseFloat(recorded_value.replace(/[^\d.-]/g, ""));
        console.log(`[checkThresholds] Parsed numeric value: ${numericValue}`);

        let thresholdTriggered = false;

        // Check if the value is outside the permitted range
        if (sensor_type === "motion") {
            // For motion sensor, check if motion is detected AND if current time is within allowed range
            console.log(
                `[checkThresholds] Checking motion sensor with value: ${recorded_value}`
            );

            if (recorded_value.toLowerCase() === "detected") {
                // Extract time range from the trigger message (format: "Motion detected between 20:00 to 06:00")
                const timeRangeMatch = threshold.trigger_message.match(
                    /between (\d{1,2}:\d{2}) to (\d{1,2}:\d{2})/
                );

                if (timeRangeMatch) {
                    const startTime = timeRangeMatch[1];
                    const endTime = timeRangeMatch[2];
                    console.log(
                        `[checkThresholds] Motion detection time range: ${startTime} to ${endTime}`
                    );

                    // Check if current time is within the configured range
                    const isWithinTimeRange = isCurrentTimeInRange(
                        startTime,
                        endTime
                    );
                    console.log(
                        `[checkThresholds] Current time is within configured range: ${isWithinTimeRange}`
                    );

                    if (isWithinTimeRange) {
                        thresholdTriggered = true;
                        console.log(
                            "[checkThresholds] Motion detected within configured time range, threshold triggered"
                        );
                    } else {
                        console.log(
                            "[checkThresholds] Motion detected outside configured time range, no alert triggered"
                        );
                    }
                } else {
                    // If no time range is found in the message, default to triggering the alert (backward compatibility)
                    thresholdTriggered = true;
                    console.log(
                        "[checkThresholds] No time range found in trigger message, defaulting to alert"
                    );
                }
            }
        } else if (!isNaN(numericValue)) {
            // For numeric sensors, check min/max thresholds
            console.log(
                `[checkThresholds] Checking numeric thresholds: ${threshold.min_threshold} <= ${numericValue} <= ${threshold.max_threshold}`
            );

            if (
                (threshold.min_threshold !== null &&
                    numericValue < threshold.min_threshold) ||
                (threshold.max_threshold !== null &&
                    numericValue > threshold.max_threshold)
            ) {
                thresholdTriggered = true;
                console.log(
                    "[checkThresholds] Value outside permitted range, threshold triggered"
                );
            } else {
                console.log(
                    "[checkThresholds] Value within permitted range, no threshold triggered"
                );
            }
        } else {
            console.log(
                "[checkThresholds] Could not parse numeric value, skipping threshold check"
            );
        }

        // If a threshold was triggered, create an alert
        if (thresholdTriggered) {
            console.log(
                "[checkThresholds] Threshold triggered, checking for existing alerts"
            );

            // First check if there's already an active alert for this sensor/park
            const [existingAlerts] = await connection.execute(
                "SELECT * FROM ActiveAlerts WHERE park_id = ? AND sensor_type = ? AND is_acknowledged = FALSE",
                [park_id, sensor_type]
            );

            console.log(
                `[checkThresholds] Found ${existingAlerts.length} existing alerts for this sensor`
            );

            if (existingAlerts.length === 0) {
                // No existing alert, create a new one
                console.log("[checkThresholds] Creating new alert");
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
                    `[checkThresholds] Created new alert for ${sensor_type} in park ${park_id}`
                );
            } else {
                // Just update the existing alert's value
                console.log("[checkThresholds] Updating existing alert");
                await connection.execute(
                    `
                    UPDATE ActiveAlerts
                    SET recorded_value = ?, created_at = CURRENT_TIMESTAMP
                    WHERE alert_id = ?
                `,
                    [recorded_value, existingAlerts[0].alert_id]
                );

                console.log(
                    `[checkThresholds] Updated existing alert for ${sensor_type} in park ${park_id}`
                );
            }
        } else {
            console.log(
                "[checkThresholds] No threshold triggered, skipping alert creation"
            );
        }
    } catch (error) {
        console.error("=================================================");
        console.error("[checkThresholds] Error checking thresholds:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack,
        });
        console.error("=================================================");
        throw error; // Propagate error to trigger transaction rollback
    }
}

// Helper function to check if current time is within specified range
// Handles both regular ranges (e.g., 09:00 to 17:00) and overnight ranges (e.g., 20:00 to 06:00)
function isCurrentTimeInRange(startTime, endTime) {
    // Get current time
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Parse start time
    const [startHours, startMinutes] = startTime.split(":").map(Number);

    // Parse end time
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    // Convert all times to minutes since midnight for easier comparison
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    const startTimeInMinutes = startHours * 60 + startMinutes;
    const endTimeInMinutes = endHours * 60 + endMinutes;

    // Handle overnight ranges (when end time is earlier than start time)
    if (endTimeInMinutes < startTimeInMinutes) {
        // If current time is after start time OR before end time, it's in range
        return (
            currentTimeInMinutes >= startTimeInMinutes ||
            currentTimeInMinutes <= endTimeInMinutes
        );
    } else {
        // Regular range (start time is before end time)
        return (
            currentTimeInMinutes >= startTimeInMinutes &&
            currentTimeInMinutes <= endTimeInMinutes
        );
    }
}
