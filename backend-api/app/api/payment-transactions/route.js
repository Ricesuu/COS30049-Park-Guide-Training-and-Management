import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { Buffer } from "buffer";
import admin from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// ✅ GET all payment transactions (no image)
export async function GET(req) {
  let connection;
  try {
    connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        payment_id, 
        user_id,
        uid,
        amountPaid, 
        paymentStatus, 
        paymentMethod,
        paymentPurpose,
        module_id,
        transaction_date
      FROM PaymentTransactions
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching payment transactions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment transactions" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// ✅ POST: Save payment with image (BLOB) and user_id
export async function POST(req) {
  let connection;
  try {
    // 🔐 Firebase token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userUid = decodedToken.uid;    // 🧾 Parse form data
    const formData = await req.formData();
    const paymentPurpose = formData.get("paymentPurpose");
    const paymentMethod = formData.get("paymentMethod");
    const amountPaid = formData.get("amountPaid");
    const receipt = formData.get("receipt");
    const moduleId = formData.get("moduleId");

    if (!paymentPurpose || !paymentMethod || !amountPaid || !receipt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Validate image
    const allowedTypes = ["image/jpeg", "image/png"];
    const MAX_SIZE = 5 * 1024 * 1024;

    if (!allowedTypes.includes(receipt.type)) {
      return NextResponse.json({ error: "Only JPG or PNG images are allowed." }, { status: 400 });
    }

    if (receipt.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    const arrayBuffer = await receipt.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔄 Resolve user_id from uid
    connection = await getConnection();
    const [users] = await connection.execute(
      `SELECT user_id FROM Users WHERE uid = ?`,
      [userUid]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found in Users table" }, { status: 404 });
    }

    const userId = users[0].user_id;    // 💾 Insert into DB
    const [result] = await connection.execute(
      `INSERT INTO PaymentTransactions
       (user_id, uid, paymentPurpose, paymentMethod, amountPaid, receipt_image, paymentStatus, transaction_date, module_id)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), ?)`,
      [userId, userUid, paymentPurpose, paymentMethod, amountPaid, buffer, moduleId]
    );
    
    // If this is a module purchase, create a ModulePurchases record
    if (moduleId) {
      try {
        // Check if the module exists
        const [moduleCheck] = await connection.execute(
          "SELECT module_id FROM TrainingModules WHERE module_id = ?",
          [moduleId]
        );
        
        if (moduleCheck.length > 0) {
          // Insert purchase record
          await connection.execute(
            `INSERT INTO ModulePurchases (user_id, module_id, payment_id)
             VALUES (?, ?, ?)`,
            [userId, moduleId, result.insertId]
          );
        }
      } catch (error) {
        console.error("Error creating module purchase record:", error);
        // Continue execution, don't fail the entire request
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment submitted and stored successfully.",
      paymentId: result.insertId
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
