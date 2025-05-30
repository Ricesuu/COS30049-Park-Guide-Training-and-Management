import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { Buffer } from "buffer";
import admin from "@/lib/firebaseAdmin";
import { assertUser } from "@/lib/assertUser";

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
    // Log request details
    console.log('Received payment transaction request');
    console.log('Request headers:', Object.fromEntries(req.headers));
    
    const formData = await req.formData();
    console.log('Received form data entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const { uid, role } = await assertUser(req);

    // Extract form data
    const paymentPurpose = formData.get("paymentPurpose");
    const paymentMethod = formData.get("paymentMethod");
    const amountPaid = formData.get("amountPaid");
    const moduleId = formData.get("moduleId");
    const receiptImage = formData.get("receipt_image");

    console.log('Parsed payment data:', {
      uid,
      paymentPurpose,
      paymentMethod,
      amountPaid,
      moduleId,
      hasReceipt: !!receiptImage
    });

    // Convert the receipt image to a Buffer if it exists
    let buffer = null;
    if (receiptImage && typeof receiptImage !== 'string') {
      const arrayBuffer = await receiptImage.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    connection = await getConnection();
    await connection.beginTransaction();

    // Get user_id
    const [users] = await connection.execute(
      `SELECT user_id FROM Users WHERE uid = ?`,
      [uid]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found in Users table" }, { status: 404 });
    }

    const userId = users[0].user_id;

    // Check if this is a module purchase
    if (moduleId) {
      // Verify module exists and get its details
      const [moduleCheck] = await connection.execute(
        "SELECT module_id, module_name, price, is_compulsory FROM TrainingModules WHERE module_id = ?",
        [moduleId]
      );
        
      if (moduleCheck.length === 0) {
        await connection.rollback();
        return NextResponse.json(
          { error: "Module not found" },
          { status: 404 }
        );
      }

      // Verify payment amount matches module price
      const modulePrice = parseFloat(moduleCheck[0].price);
      const paidAmount = parseFloat(amountPaid);
      
      if (paidAmount < modulePrice) {
        await connection.rollback();
        return NextResponse.json(
          { error: "Payment amount does not match module price" },
          { status: 400 }
        );
      }

      // For non-compulsory modules, check if user has completed all compulsory modules
      if (!moduleCheck[0].is_compulsory) {
        // Get all compulsory modules
        const [compulsoryModules] = await connection.execute(
          `SELECT tm.module_id, tm.module_name
           FROM TrainingModules tm
           WHERE tm.is_compulsory = TRUE`,
          []
        );

        // Get user's completed compulsory modules
        const [completedCompulsory] = await connection.execute(
          `SELECT tm.module_id
           FROM TrainingModules tm
           JOIN ModulePurchases mp ON tm.module_id = mp.module_id
           JOIN PaymentTransactions pt ON mp.payment_id = pt.payment_id
           WHERE tm.is_compulsory = TRUE 
           AND mp.user_id = ? 
           AND mp.status = 'active'
           AND pt.paymentStatus = 'approved'`,
          [userId]
        );

        // Check if any compulsory modules are missing
        if (completedCompulsory.length < compulsoryModules.length) {
          const completedIds = new Set(completedCompulsory.map(m => m.module_id));
          const missingModules = compulsoryModules
            .filter(m => !completedIds.has(m.module_id))
            .map(m => m.module_name)
            .join(', ');

          await connection.rollback();
          return NextResponse.json(
            { error: `You must complete the following compulsory modules first: ${missingModules}` },
            { status: 400 }
          );
        }
      }
    }

    // Insert payment transaction
    const [result] = await connection.execute(
      `INSERT INTO PaymentTransactions
       (user_id, uid, paymentPurpose, paymentMethod, amountPaid, receipt_image, paymentStatus, transaction_date, module_id)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), ?)`,
      [userId, uid, paymentPurpose, paymentMethod, amountPaid, buffer, moduleId]
    );      

    // Create ModulePurchases record for module purchases
    if (moduleId) {
      try {
        // Check if a purchase record already exists
        const [existingPurchase] = await connection.execute(
          `SELECT purchase_id, status 
           FROM ModulePurchases 
           WHERE user_id = ? AND module_id = ? AND is_active = TRUE`,
          [userId, moduleId]
        );
        
        if (existingPurchase.length === 0) {
          // Insert new purchase record
          await connection.execute(
            `INSERT INTO ModulePurchases 
             (user_id, module_id, payment_id, status, is_active) 
             VALUES (?, ?, ?, 'pending', TRUE)`,
            [userId, moduleId, result.insertId]
          );
        } else {
          if (existingPurchase[0].status === 'active') {
            await connection.rollback();
            return NextResponse.json(
              { error: "You have already purchased this module" },
              { status: 400 }
            );
          } else {
            // Update existing pending/rejected purchase to link to new payment
            await connection.execute(
              `UPDATE ModulePurchases 
               SET payment_id = ?, status = 'pending', is_active = TRUE 
               WHERE user_id = ? AND module_id = ?`,
              [result.insertId, userId, moduleId]
            );
          }
        }
      } catch (error) {
        await connection.rollback();
        console.error("Error managing module purchase record:", error);
        return NextResponse.json(
          { error: "Failed to process module purchase" },
          { status: 500 }
        );
      }
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Payment submitted successfully.",
      paymentId: result.insertId
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
