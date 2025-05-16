// app/api/payment-transactions/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { Buffer } from "buffer";

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
        const body = await request.json();
        // Extract fields from the request body with the correct names
        const { user_id, amountPaid, paymentStatus, paymentMethod } = body;

        connection = await getConnection();

        // Build SQL dynamically based on the provided fields
        let sqlParts = [];
        let values = [];

        if (user_id !== undefined) {
            sqlParts.push("user_id = ?");
            values.push(user_id);
        }

        if (amountPaid !== undefined) {
            sqlParts.push("amountPaid = ?");
            values.push(amountPaid);
        }

        if (paymentStatus !== undefined) {
            sqlParts.push("paymentStatus = ?");
            values.push(paymentStatus);
        }

        if (paymentMethod !== undefined) {
            sqlParts.push("paymentMethod = ?");
            values.push(paymentMethod);
        }

        // Support for old field names for backwards compatibility
        if (body.amount !== undefined && amountPaid === undefined) {
            sqlParts.push("amountPaid = ?");
            values.push(body.amount);
        }

        if (body.payment_status !== undefined && paymentStatus === undefined) {
            sqlParts.push("paymentStatus = ?");
            values.push(body.payment_status);
        }

        if (body.payment_method !== undefined && paymentMethod === undefined) {
            sqlParts.push("paymentMethod = ?");
            values.push(body.payment_method);
        }

        if (sqlParts.length === 0) {
            return NextResponse.json(
                { error: "No fields to update provided" },
                { status: 400 }
            );
        }        const sqlQuery = `UPDATE PaymentTransactions SET ${sqlParts.join(
            ", "
        )} WHERE payment_id = ?`;
        values.push(id);

        const [result] = await connection.execute(sqlQuery, values);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Payment transaction not found" },
                { status: 404 }
            );
        }        // When payment status changes to approved, update the ModulePurchases record too
        if (paymentStatus === 'approved') {
            try {
                // First check if this payment has a related module purchase
                const [modulePayment] = await connection.execute(
                    `SELECT module_id, user_id FROM PaymentTransactions WHERE payment_id = ?`,
                    [id]
                );
                
                if (modulePayment.length > 0 && modulePayment[0].module_id) {
                    const moduleId = modulePayment[0].module_id;
                    const userId = modulePayment[0].user_id;
                    
                    console.log(`Payment ID ${id} is for module ID ${moduleId}`);
                    
                    // Check if there's already a ModulePurchases record
                    const [existingPurchase] = await connection.execute(
                        `SELECT purchase_id FROM ModulePurchases WHERE payment_id = ? AND module_id = ?`,
                        [id, moduleId]
                    );
                    
                    if (existingPurchase.length === 0) {
                        // No ModulePurchases record exists, create one
                        console.log(`Creating missing ModulePurchases record for moduleId: ${moduleId}, userId: ${userId}, paymentId: ${id}`);
                        
                        await connection.execute(
                            `INSERT INTO ModulePurchases (user_id, module_id, payment_id, status)
                             VALUES (?, ?, ?, 'pending')`,
                            [userId, moduleId, id]
                        );
                        
                        console.log(`ModulePurchases record created successfully`);
                    }
                    
                    // Now update the module purchase status to active
                    await connection.execute(
                        `UPDATE ModulePurchases SET status = 'active' WHERE payment_id = ?`,
                        [id]
                    );
                    
                    console.log(`ModulePurchases record updated to 'active' status`);
                }
            } catch (moduleError) {
                console.error(`Error updating ModulePurchases record:`, moduleError);
                // Don't fail the transaction if updating ModulePurchases fails
            }
        } else if (paymentStatus === 'rejected') {
            // For rejected payments, update ModulePurchases status accordingly
            try {
                await connection.execute(
                    `UPDATE ModulePurchases SET status = 'rejected' WHERE payment_id = ?`,
                    [id]
                );
            } catch (moduleError) {
                console.error(`Error updating ModulePurchases record for rejected payment:`, moduleError);
            }
        }

        return NextResponse.json({
            message: `Payment transaction with ID ${id} updated successfully`,
        });
    } catch (error) {
        console.error(
            `Error updating payment transaction with ID ${id}:`,
            error
        );
        return NextResponse.json(
            {
                error: `Failed to update payment transaction with ID ${id}: ${error.message}`,
            },
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
