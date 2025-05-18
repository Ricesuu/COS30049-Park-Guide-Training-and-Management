import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// Update user's module progress
export async function POST(request) {
    let connection;
    try {
        // Parse request body
        const body = await request.json();
        const { moduleId, progress } = body;
        
        if (!moduleId || progress === undefined) {
            return NextResponse.json(
                { error: "Module ID and progress are required" },
                { status: 400 }
            );
        }

        // Authenticate the user (only park_guide role can update their own progress)
        const { uid, role } = await assertUser(request, ["park_guide"]);

        connection = await getConnection();
        
        // Get user_id from the Users table based on the firebase uid
        const [userRows] = await connection.execute(
            "SELECT user_id FROM Users WHERE uid = ?",
            [uid]
        );

        if (userRows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userId = userRows[0].user_id;

        // Check if user has access to this module
        const [accessRows] = await connection.execute(`
            SELECT purchase_id, completion_percentage
            FROM ModulePurchases
            WHERE user_id = ? AND module_id = ? AND status = 'active' AND is_active = TRUE
        `, [userId, moduleId]);

        if (accessRows.length === 0) {
            return NextResponse.json(
                { error: "User does not have access to this module" },
                { status: 403 }
            );
        }

        const purchaseId = accessRows[0].purchase_id;
        const currentProgress = accessRows[0].completion_percentage || 0;

        // Only update if new progress is higher than current progress
        if (progress <= currentProgress) {
            return NextResponse.json({
                message: "Progress not updated as new progress is not higher than current progress",
                currentProgress
            });
        }

        // Update the completion percentage
        await connection.execute(`
            UPDATE ModulePurchases
            SET completion_percentage = ?
            WHERE purchase_id = ?
        `, [progress, purchaseId]);

        return NextResponse.json({
            message: "Module progress updated successfully",
            moduleId,
            progress
        });
    } catch (error) {
        console.error("Error updating module progress:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update module progress" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
