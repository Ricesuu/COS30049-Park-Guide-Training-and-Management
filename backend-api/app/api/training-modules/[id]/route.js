// app/api/training-modules/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

export async function GET(request, { params }) {
    let connection;
    try {
        // Get moduleId from params safely - await the params in Next.js 14
        const context = await params;
        const id = context?.id;

        if (!id) {
            return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
        }

        // Authenticate the user
        const { uid, role } = await assertUser(request);

        connection = await getConnection();
        
        // Get user_id from uid
        const [users] = await connection.execute(
            "SELECT user_id FROM Users WHERE uid = ?",
            [uid]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userId = users[0].user_id;

        // First get the module details with purchase status
        const [rows] = await connection.execute(
            `SELECT 
                tm.*,
                mp.status as purchase_status,
                pt.paymentStatus as payment_status
             FROM TrainingModules tm
             LEFT JOIN (
                SELECT module_id, status, payment_id
                FROM ModulePurchases 
                WHERE user_id = ? AND is_active = TRUE
             ) mp ON tm.module_id = mp.module_id
             LEFT JOIN PaymentTransactions pt ON mp.payment_id = pt.payment_id
             WHERE tm.module_id = ?`,
            [userId, id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Training module not found" },
                { status: 404 }
            );
        }

        const moduleData = rows[0];

        // If module is free, allow access
        if (moduleData.price === 0 || moduleData.price === "0" || moduleData.price === "0.00") {
            return NextResponse.json(moduleData);
        }

        // For paid modules, if no purchase record exists
        if (!moduleData.purchase_status) {
            return NextResponse.json(
                { error: "You don't have access to this module" },
                { status: 403 }
            );
        }

        // For modules with pending payments
        if (moduleData.payment_status === 'pending') {
            return NextResponse.json(
                { error: "Your payment is pending approval" },
                { status: 403 }
            );
        }

        // For rejected payments
        if (moduleData.payment_status === 'rejected') {
            return NextResponse.json(
                { error: "Your payment was rejected" },
                { status: 403 }
            );
        }

        // Allow access only if payment is approved
        if (moduleData.payment_status === 'approved' && moduleData.purchase_status === 'active') {
            return NextResponse.json(moduleData);
        }

        // Default deny access
        return NextResponse.json(
            { error: "Access to this module is restricted" },
            { status: 403 }
        );

    } catch (error) {
        console.error(`Error fetching training module with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch training module with ID ${id}` },
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
        const { module_name, description, duration, price } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE TrainingModules SET module_name = ?, description = ?, duration = ?, price = ? WHERE module_id = ?",
            [module_name, description, duration, price || 0.0, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Training module not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Training module with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(`Error updating training module with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to update training module with ID ${id}` },
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
            "DELETE FROM TrainingModules WHERE module_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Training module not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Training module with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting training module with ID ${id}:`, error);
        return NextResponse.json(
            { error: `Failed to delete training module with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
