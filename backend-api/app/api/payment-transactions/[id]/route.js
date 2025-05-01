// app/api/payment-transactions/[id]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

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
        return NextResponse.json(rows[0]);
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
    try {
        const body = await request.json();
        const { user_id, amount, payment_status, payment_method } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "UPDATE PaymentTransactions SET user_id = ?, amount = ?, payment_status = ?, payment_method = ? WHERE payment_id = ?",
            [user_id, amount, payment_status, payment_method, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Payment transaction not found" },
                { status: 404 }
            );
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
            { error: `Failed to update payment transaction with ID ${id}` },
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
