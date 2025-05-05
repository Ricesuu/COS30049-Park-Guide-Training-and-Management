import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
    let connection;

    try {
        connection = await getConnection();

        // Step 1: Get payment transactions
        const [transactions] = await connection.execute(
            `SELECT * FROM PaymentTransactions WHERE payment_status = 'pending'`
        );

        // Step 2: For each transaction, get the user details
        const results = [];

        for (const transaction of transactions) {
            const [users] = await connection.execute(
                `SELECT first_name, last_name, email FROM Users WHERE user_id = ?`,
                [transaction.user_id]
            );

            if (users.length > 0) {
                results.push({
                    ...transaction,
                    first_name: users[0].first_name,
                    last_name: users[0].last_name,
                    email: users[0].email,
                });
            } else {
                results.push({
                    ...transaction,
                    first_name: "Unknown",
                    last_name: "User",
                    email: "No email provided",
                });
            }
        }

        // Remove this line that's causing the log output:
        // console.log("Final results:", results);

        return NextResponse.json(results, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
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
