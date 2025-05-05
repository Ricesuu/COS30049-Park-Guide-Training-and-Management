import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { saveFile } from "@/lib/saveFile";
import { Buffer } from "buffer";
import admin from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// Updated GET method to include paymentPurpose and receipt_path
export async function GET(req) {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT 
                payment_id, 
                user_id,
                uid,
                amount, 
                payment_status, 
                payment_method,
                paymentPurpose,
                receipt_path,
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

export async function POST(req) {
    try {
        // 🔐 Extract and verify Firebase ID token
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized: No token provided" },
                { status: 401 }
            );
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userUid = decodedToken.uid;

        // 🧾 Get multipart/form-data fields and file
        const formData = await req.formData();

        const paymentPurpose = formData.get("paymentPurpose");
        const paymentMethod = formData.get("paymentMethod");
        const amountPaid = formData.get("amountPaid");
        const receipt = formData.get("receipt"); // File object

        if (!paymentPurpose || !paymentMethod || !amountPaid || !receipt) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        // ✅ Validate file
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(receipt.type)) {
            return NextResponse.json(
                { error: "Only JPG or PNG images are allowed." },
                { status: 400 }
            );
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        if (receipt.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit." },
                { status: 400 }
            );
        }

        // 💾 Save file
        const arrayBuffer = await receipt.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const savedPath = await saveFile(buffer, receipt.name);

        // 🧾 Insert into DB
        const connection = await getConnection();
        await connection.execute(
            `INSERT INTO PaymentTransactions
       (uid, paymentPurpose, paymentMethod, amountPaid, receipt_path, paymentStatus, createdAt)
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
            [userUid, paymentPurpose, paymentMethod, amountPaid, savedPath]
        );
        connection.release();

        return NextResponse.json({
            success: true,
            message: "Payment submitted",
        });
    } catch (error) {
        console.error("Payment submission error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
