import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { sendEmail } from "@/lib/emailService";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get("type");
    const connection = await getConnection();

    try {
        if (dataType === "guides") {
            const [guides] = await connection.execute(`
        SELECT 
          pg.guide_id,
          u.first_name,
          u.last_name,
          u.email,
          pg.certification_status,
          GROUP_CONCAT(DISTINCT gtp.module_id) AS assigned_modules
        FROM ParkGuides pg
        JOIN Users u ON pg.user_id = u.user_id
        LEFT JOIN GuideTrainingProgress gtp ON pg.guide_id = gtp.guide_id
        WHERE pg.certification_status = 'certified'
        GROUP BY pg.guide_id
      `);

            const formattedGuides = guides.map((guide) => ({
                ...guide,
                assigned_modules: guide.assigned_modules
                    ? guide.assigned_modules.split(",").map(Number)
                    : [],
            }));

            return NextResponse.json(formattedGuides);
        }

        if (dataType === "modules") {
            const [modules] = await connection.execute(
                "SELECT * FROM TrainingModules WHERE price = 0.00"
            );
            return NextResponse.json(modules);
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

export async function POST(request) {
    const body = await request.json();
    const { guide_id, module_ids } = body;

    if (!guide_id || !Array.isArray(module_ids)) {
        return NextResponse.json(
            { error: "guide_id and module_ids are required!" },
            { status: 400 }
        );
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(
            `DELETE FROM GuideTrainingProgress 
       WHERE guide_id = ? AND status = 'in progress'`,
            [guide_id]
        );

        for (const module_id of module_ids) {
            await connection.execute(
                `INSERT INTO GuideTrainingProgress 
         (guide_id, module_id, status, completion_date) 
         VALUES (?, ?, 'in progress', NULL)`,
                [guide_id, module_id]
            );
        }

        const [guideInfo] = await connection.execute(
            `SELECT u.email, u.first_name, tm.module_name
       FROM ParkGuides pg
       JOIN Users u ON pg.user_id = u.user_id
       JOIN GuideTrainingProgress gtp ON pg.guide_id = gtp.guide_id
       JOIN TrainingModules tm ON gtp.module_id = tm.module_id
       WHERE pg.guide_id = ? AND gtp.status = 'in progress'`,
            [guide_id]
        );

        if (guideInfo.length === 0) {
            throw new Error("Guide not found");
        }
        for (const moduleRow of guideInfo) {
            await sendEmail({
                to: moduleRow.email,
                template: "moduleAssignment",
                data: {
                    firstName: moduleRow.first_name,
                    moduleName: moduleRow.module_name,
                },
            });
        }

        await connection.commit();

        return NextResponse.json({
            success: true,
            message: "Modules assigned and notification email sent!",
            assigned: module_ids,
        });
    } catch (error) {
        await connection.rollback();
        console.error("Failed to update modules:", error);
        return NextResponse.json(
            { error: error.message || "Update error" },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

export async function DELETE(request) {
    const { guide_id } = await request.json();

    if (!guide_id || isNaN(guide_id)) {
        return NextResponse.json(
            { error: "A valid guide_id is required!" },
            { status: 400 }
        );
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        // First check if the guide exists and get guide info
        const [guideInfo] = await connection.execute(
            `SELECT pg.guide_id, u.email, u.first_name 
             FROM ParkGuides pg
             JOIN Users u ON pg.user_id = u.user_id 
             WHERE pg.guide_id = ?`,
            [guide_id]
        );

        if (guideInfo.length === 0) {
            throw new Error("Guide not found");
        }

        // Get modules that are being deleted
        const [moduleDetails] = await connection.execute(
            `SELECT tm.module_id, tm.module_code, tm.module_name 
             FROM GuideTrainingProgress gtp
             JOIN TrainingModules tm ON gtp.module_id = tm.module_id 
             WHERE gtp.guide_id = ? AND gtp.status = 'in progress'`,
            [guide_id]
        );

        if (moduleDetails.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No in-progress modules found for this guide.",
                guide_id,
            });
        }

        // Remove from GuideTrainingProgress
        await connection.execute(
            `DELETE FROM GuideTrainingProgress 
             WHERE guide_id = ? AND status = 'in progress'`,
            [guide_id]
        );

        // Send email notification
        const moduleNames = moduleDetails.map((m) => m.module_name).join(", ");
        await sendEmail({
            to: guideInfo[0].email,
            template: "moduleRemoval",
            data: {
                firstName: guideInfo[0].first_name,
                courseNames: moduleNames,
            },
        });

        await connection.commit();
        return NextResponse.json({
            success: true,
            message:
                "Successfully deleted modules and sent cancellation email!",
            guide_id,
        });
    } catch (error) {
        await connection.rollback();
        console.error("Failed to delete modules or send email:", error);
        return NextResponse.json(
            {
                error:
                    error.message || "An error occurred while deleting modules",
            },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

export async function PUT(request) {
    const body = await request.json();
    const { guide_id, module_ids } = body;

    if (!guide_id || !Array.isArray(module_ids)) {
        return NextResponse.json(
            { error: "guide_id and module_ids are required!" },
            { status: 400 }
        );
    }
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const [currentRows] = await connection.execute(
            `SELECT module_id FROM GuideTrainingProgress 
       WHERE guide_id = ? AND status = 'in progress'`,
            [guide_id]
        );

        const currentModuleIds = currentRows.map((row) => row.module_id);

        const modulesToAdd = module_ids.filter(
            (id) => !currentModuleIds.includes(id)
        );
        const modulesToRemove = currentModuleIds.filter(
            (id) => !module_ids.includes(id)
        );

        if (modulesToRemove.length > 0) {
            await connection.execute(
                `DELETE FROM GuideTrainingProgress 
         WHERE guide_id = ? AND module_id IN (${modulesToRemove
             .map(() => "?")
             .join(",")})`,
                [guide_id, ...modulesToRemove]
            );
        }

        for (const module_id of modulesToAdd) {
            await connection.execute(
                `INSERT INTO GuideTrainingProgress 
         (guide_id, module_id, status, completion_date) 
         VALUES (?, ?, 'in progress', NULL)`,
                [guide_id, module_id]
            );
        }

        const [rows] = await connection.execute(
            `SELECT u.email, u.first_name 
       FROM ParkGuides pg
       JOIN Users u ON pg.user_id = u.user_id
       WHERE pg.guide_id = ?`,
            [guide_id]
        );

        if (rows.length === 0) {
            throw new Error("Guide not found");
        }
        const { email, first_name } = rows[0];

        // Get added and removed module details
        const [addedModules] = await connection.query(
            `SELECT module_code, module_name 
       FROM TrainingModules 
       WHERE module_id IN (${modulesToAdd.map(() => "?").join(",")})`,
            modulesToAdd
        );

        const [removedModules] = await connection.query(
            `SELECT module_code, module_name 
       FROM TrainingModules 
       WHERE module_id IN (${modulesToRemove.map(() => "?").join(",")})`,
            modulesToRemove
        );

        // Send email about module updates
        const updateMessage = [
            ...(addedModules.length > 0
                ? [
                      "Added: " +
                          addedModules.map((m) => m.module_name).join(", "),
                  ]
                : []),
            ...(removedModules.length > 0
                ? [
                      "Removed: " +
                          removedModules.map((m) => m.module_name).join(", "),
                  ]
                : []),
        ].join(" | ");

        await sendEmail({
            to: email,
            template: "moduleAssignment",
            data: {
                firstName: first_name,
                moduleName: "Course updates: " + updateMessage,
            },
        });

        await connection.commit();

        return NextResponse.json({
            success: true,
            message: "Modules updated and notification email sent!",
            added: modulesToAdd,
            removed: modulesToRemove,
        });
    } catch (error) {
        await connection.rollback();
        console.error("Failed to update modules:", error);
        return NextResponse.json(
            { error: error.message || "Update error" },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE,PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
