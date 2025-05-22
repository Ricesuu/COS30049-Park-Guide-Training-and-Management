import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// GET: Check if a user has access to a specific module
export async function GET(request, { params }) {
    let connection;
    try {
        const moduleId = params.id;

        // Authenticate the user
        const { uid, role } = await assertUser(request);

        connection = await getConnection();

        // First get the user_id from uid
        const [users] = await connection.execute(
            `SELECT user_id FROM Users WHERE uid = ?`,
            [uid]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userId = users[0].user_id;
        // Check if the module is free (no purchase needed)
        const [modules] = await connection.execute(
            `SELECT is_premium FROM TrainingModules WHERE module_id = ?`,
            [moduleId]
        );

        if (modules.length === 0) {
            return NextResponse.json(
                { error: "Module not found" },
                { status: 404 }
            );
        }
        // If module is free (price is 0), access is granted
        if (modules[0].price === 0 || modules[0].price === "0.00") {
            return NextResponse.json({
                hasAccess: true,
                reason: "free_module",
            });
        }

        // For paid modules, check if user has purchased it
        const [purchases] = await connection.execute(
            `SELECT mp.status, pt.paymentStatus
       FROM ModulePurchases mp
       JOIN PaymentTransactions pt ON mp.payment_id = pt.payment_id
       WHERE mp.user_id = ? AND mp.module_id = ? AND mp.is_active = TRUE`,
            [userId, moduleId]
        );

        if (purchases.length === 0) {
            return NextResponse.json({
                hasAccess: false,
                reason: "not_purchased",
            });
        }

        const purchase = purchases[0];

        // Check payment status
        if (purchase.paymentStatus !== "approved") {
            return NextResponse.json({
                hasAccess: false,
                reason: "payment_pending",
                status: purchase.paymentStatus,
            });
        }

        // Check purchase status
        if (purchase.status !== "active") {
            return NextResponse.json({
                hasAccess: false,
                reason: "access_" + purchase.status,
            });
        }

        // All checks passed, user has access
        return NextResponse.json({
            hasAccess: true,
            reason: "purchased",
        });
    } catch (error) {
        console.error("Error checking module access:", error);
        return NextResponse.json(
            { error: error.message || "Failed to check module access" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
