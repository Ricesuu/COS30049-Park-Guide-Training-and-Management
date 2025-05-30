import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { Buffer } from "buffer";
import admin from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req) {
  let connection;
  try {
    // 🔐 Firebase token verification
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userUid = decodedToken.uid;

    // 📥 Fetch transactions for current user
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT 
         payment_id,
         paymentPurpose,
         amountPaid,
         paymentMethod,
         paymentStatus,
         transaction_date,
         receipt_image
       FROM PaymentTransactions
       WHERE uid = ?
       ORDER BY transaction_date DESC`,
      [userUid]
    );

    // 🔁 Convert receipt image to base64
    const transactions = rows.map((row) => ({
      payment_id: row.payment_id,
      paymentPurpose: row.paymentPurpose,
      amountPaid: row.amountPaid,
      paymentMethod: row.paymentMethod,
      paymentStatus: row.paymentStatus,
      transaction_date: row.transaction_date,
      receiptImageBase64: row.receipt_image
        ? Buffer.from(row.receipt_image).toString("base64")
        : null,
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching user payment history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve payment history" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
