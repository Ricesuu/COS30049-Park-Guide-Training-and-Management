// app/api/guide-training-progress/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM GuideTrainingProgress"
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching guide training progress:", error);
        return NextResponse.json(
            { error: "Failed to fetch guide training progress" },
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
        const { guide_id, module_id, status, completion_date } = body;

        if (!guide_id || !module_id || !status) {
            return NextResponse.json(
                {
                    error: "Missing required fields: guide_id, module_id, and status are required",
                },
                { status: 400 }
            );
        }

        // Validate status values
        const validStatuses = ["in progress", "completed", "failed"];
        if (!validStatuses.includes(status.toLowerCase())) {
            return NextResponse.json(
                {
                    error: `Invalid status. Must be one of: ${validStatuses.join(
                        ", "
                    )}`,
                },
                { status: 400 }
            );
        }

        connection = await getConnection();

        // First check if the park guide exists and has already been approved by admin
        const [guideRows] = await connection.execute(
            `
            SELECT pg.guide_id, pg.certification_status, u.status as user_status 
            FROM ParkGuides pg
            JOIN Users u ON pg.user_id = u.user_id
            WHERE pg.guide_id = ?
        `,
            [guide_id]
        );

        if (guideRows.length === 0) {
            return NextResponse.json(
                { error: "Park guide not found or not yet approved by admin" },
                { status: 404 }
            );
        }

        // Check if this module is already in progress for this guide
        const [existingRows] = await connection.execute(
            "SELECT * FROM GuideTrainingProgress WHERE guide_id = ? AND module_id = ?",
            [guide_id, module_id]
        );

        // Use a transaction since we may need to update or insert
        await connection.beginTransaction();

        try {
            let result;
            let message = "";

            if (existingRows.length > 0) {
                // Update existing record
                const currentStatus = existingRows[0].status;

                // Only allow updating to 'completed' from 'in progress'
                if (
                    status.toLowerCase() === "completed" &&
                    currentStatus.toLowerCase() === "in progress"
                ) {
                    // Set completion date to now if not provided
                    const completionDateValue =
                        completion_date ||
                        new Date().toISOString().split("T")[0];

                    [result] = await connection.execute(
                        "UPDATE GuideTrainingProgress SET status = ?, completion_date = ? WHERE guide_id = ? AND module_id = ?",
                        [status, completionDateValue, guide_id, module_id]
                    );

                    message = "Training module marked as completed";
                } else {
                    // For other status changes, just update the status
                    [result] = await connection.execute(
                        "UPDATE GuideTrainingProgress SET status = ? WHERE guide_id = ? AND module_id = ?",
                        [status, guide_id, module_id]
                    );

                    message = "Training progress updated";
                }
            } else {
                // Create new record - completion_date only applies to 'completed' status
                const completionDateValue =
                    status.toLowerCase() === "completed"
                        ? completion_date ||
                          new Date().toISOString().split("T")[0]
                        : null;

                [result] = await connection.execute(
                    "INSERT INTO GuideTrainingProgress (guide_id, module_id, status, completion_date) VALUES (?, ?, ?, ?)",
                    [guide_id, module_id, status, completionDateValue]
                );

                message =
                    status.toLowerCase() === "in progress"
                        ? "Guide has started training module"
                        : "Training progress recorded";
            }

            await connection.commit();

            // Check if all required modules are completed when marking a module as completed
            if (status.toLowerCase() === "completed") {
                // This is just an informational check, doesn't affect the transaction
                const [moduleResults] = await connection.execute(
                    `
                    SELECT 
                        COUNT(TM.module_id) as total_required_modules,
                        COUNT(GTP.module_id) as completed_modules
                    FROM 
                        TrainingModules TM
                    LEFT JOIN 
                        GuideTrainingProgress GTP ON TM.module_id = GTP.module_id 
                        AND GTP.guide_id = ? AND GTP.status = 'completed'
                    WHERE 
                        TM.is_required = true
                `,
                    [guide_id]
                );

                const { total_required_modules, completed_modules } =
                    moduleResults[0];

                if (
                    total_required_modules === completed_modules &&
                    total_required_modules > 0
                ) {
                    message +=
                        ". All required modules completed! Guide is ready for certification.";
                }
            }

            return NextResponse.json(
                {
                    id:
                        existingRows.length > 0
                            ? existingRows[0].id
                            : result.insertId,
                    message,
                    status: status,
                },
                { status: existingRows.length > 0 ? 200 : 201 }
            );
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        console.error("Error tracking guide training progress:", error);
        return NextResponse.json(
            {
                error: "Failed to update guide training progress",
                details: error.message,
            },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
