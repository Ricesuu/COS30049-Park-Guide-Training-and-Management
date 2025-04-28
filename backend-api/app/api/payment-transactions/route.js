// app/api/payment-transactions/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM PaymentTransactions"
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching payment transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch payment transactions" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, amount, payment_status, payment_method } = body;
        const connection = await getConnection();
        const [result] = await connection.execute(
            "INSERT INTO PaymentTransactions (user_id, amount, payment_status, payment_method) VALUES (?, ?, ?, ?)",
            [user_id, amount, payment_status, payment_method]
        );
        return NextResponse.json(
            {
                id: result.insertId,
                message: "Payment transaction created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating payment transaction:", error);
        return NextResponse.json(
            { error: "Failed to create payment transaction" },
            { status: 500 }
        );
    }
}
