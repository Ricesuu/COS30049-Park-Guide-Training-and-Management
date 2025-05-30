// app/api/payment-transactions/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { Buffer } from "buffer";
import { sendEmail } from "@/lib/emailService";

export async function GET(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM PaymentTransactions WHERE payment_id = ?",
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Payment transaction not found" },
                { status: 404 }
            );
        }

        // Convert receipt_image BLOB to Base64 string
        const transaction = rows[0];
        if (transaction.receipt_image) {
            transaction.receipt_image = Buffer.from(
                transaction.receipt_image
            ).toString("base64");
        }

        return NextResponse.json(transaction);
    } catch (error) {
        console.error(
            `Error fetching payment transaction with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to fetch payment transaction with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    let connection;

    try {
        const { paymentStatus } = await request.json();

        if (!paymentStatus) {
            return NextResponse.json(
                { error: "Payment status is required" },
                { status: 400 }
            );
        }

        connection = await getConnection();

        // Get the current payment status before updating
        const [currentPayment] = await connection.execute(
            "SELECT paymentStatus, module_id, user_id FROM PaymentTransactions WHERE payment_id = ?",
            [id]
        );

        if (currentPayment.length === 0) {
            return NextResponse.json(
                { error: "Payment transaction not found" },
                { status: 404 }
            );
        }

        // Begin transaction
        await connection.beginTransaction();

        // Update payment status
        await connection.execute(
            "UPDATE PaymentTransactions SET paymentStatus = ? WHERE payment_id = ?",
            [paymentStatus, id]
        );

        // If this payment is for a module purchase and it was approved
        if (currentPayment[0].module_id && paymentStatus === "approved") {
            const moduleId = currentPayment[0].module_id;
            const userId = currentPayment[0].user_id;

            // Check if there's a ModulePurchases record
            const [existingPurchase] = await connection.execute(
                `SELECT purchase_id FROM ModulePurchases WHERE payment_id = ? AND module_id = ?`,
                [id, moduleId]
            );

            if (existingPurchase.length === 0) {
                // Create new module purchase record if it doesn't exist
                await connection.execute(
                    `INSERT INTO ModulePurchases (user_id, module_id, payment_id, status, is_active)
                     VALUES (?, ?, ?, 'active', 1)`,
                    [userId, moduleId, id]
                );
            } else {
                // Update existing module purchase record
                await connection.execute(
                    `UPDATE ModulePurchases SET status = 'active', is_active = 1 
                     WHERE payment_id = ? AND module_id = ?`,
                    [id, moduleId]
                );
            }

            // Get user and module info for email notification
            const [userInfo] = await connection.execute(
                `SELECT u.email, u.first_name, tm.module_name
                 FROM Users u
                 JOIN TrainingModules tm ON tm.module_id = ?
                 WHERE u.user_id = ?`,
                [moduleId, userId]
            );
            if (userInfo.length > 0) {
                // Send module assignment email
                await sendEmail({
                    to: userInfo[0].email,
                    template: "moduleAssignment",
                    data: {
                        firstName: userInfo[0].first_name,
                        moduleName: userInfo[0].module_name,
                    },
                });
            }
        } else if (paymentStatus === "rejected") {
            // Update any existing module purchase record to rejected status
            await connection.execute(
                `UPDATE ModulePurchases SET status = 'rejected', is_active = 0 
                 WHERE payment_id = ? AND module_id = ?`,
                [id, currentPayment[0].module_id]
            );
        }

        // Commit all changes
        await connection.commit();

        return NextResponse.json({
            message: `Payment transaction with ID ${id} updated successfully`,
            status: paymentStatus,
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error(
            `Error updating payment transaction with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to update payment transaction: ${error.message}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    let connection;
    try {
        connection = await getConnection();
        const [result] = await connection.execute(
            "DELETE FROM PaymentTransactions WHERE payment_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Payment transaction not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: `Payment transaction with ID ${id} deleted successfully`,
        });
    } catch (error) {
        console.error(
            `Error deleting payment transaction with ID ${id}:`,
            error
        );
        return NextResponse.json(
            { error: `Failed to delete payment transaction with ID ${id}` },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
