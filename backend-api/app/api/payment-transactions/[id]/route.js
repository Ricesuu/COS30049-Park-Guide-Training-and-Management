import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function PUT(request, { params }) {
    console.log("PUT request received for transaction ID:", params.id);
    const { id } = params;
    let connection = null;

    try {
        // Parse JSON body
        const requestBody = await request.json();
        console.log("Request body:", requestBody);

        // Validate payment_status
        const validStatuses = ["pending", "completed", "failed"];
        const payment_status = requestBody.payment_status;

        if (!payment_status || !validStatuses.includes(payment_status)) {
            console.error("Invalid payment_status:", payment_status);
            return NextResponse.json(
                {
                    error: "Invalid payment_status value. Must be one of: pending, completed, failed",
                },
                { status: 400 }
            );
        }

        console.log(
            `Attempting to update transaction ${id} to status: ${payment_status}`
        );

        // Make sure ID is valid
        if (!id || isNaN(parseInt(id, 10))) {
            console.error("Invalid ID parameter:", id);
            return NextResponse.json(
                { error: "Invalid transaction ID" },
                { status: 400 }
            );
        }

        // Get DB connection
        connection = await getConnection();

        // Use prepared statement with execute instead of query
        const [result] = await connection.execute(
            "UPDATE PaymentTransactions SET payment_status = ? WHERE payment_id = ?",
            [payment_status, parseInt(id, 10)]
        );

        console.log("Query result:", result);

        if (result.affectedRows === 0) {
            console.log(`No transaction found with ID ${id}`);
            return NextResponse.json(
                { error: "Payment transaction not found" },
                { status: 404 }
            );
        }

        console.log(
            `Successfully updated transaction ${id} status to ${payment_status}`
        );

        // Return success response
        return NextResponse.json({
            message: `Payment transaction with ID ${id} updated successfully`,
            status: payment_status,
            success: true,
        });
    } catch (error) {
        console.error("Error in PUT handler:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) {
            try {
                connection.release();
                console.log("Database connection released");
            } catch (err) {
                console.error("Error releasing connection:", err);
            }
        }
    }
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
