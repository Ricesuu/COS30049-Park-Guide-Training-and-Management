import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// GET: Check the purchase status of a module for the current user
export async function GET(request, { params }) {
  let connection;
  try {
    const moduleId = params.id;
    
    // Authenticate the user
    const { uid, role } = await assertUser(request);
    
    connection = await getConnection();
    
    // First get the user_id from uid
    const [users] = await connection.execute(
      `SELECT user_id FROM Users WHERE uid = ?`,
      [uid]
    );
    
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const userId = users[0].user_id;
      // Get module info
    const [modules] = await connection.execute(
      `SELECT module_id, module_name, price, is_premium 
       FROM TrainingModules 
       WHERE module_id = ?`,
      [moduleId]
    );
    
    if (modules.length === 0) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }
    
    const moduleInfo = modules[0];
    
    // If module is not premium, it's accessible without purchase
    if (!moduleInfo.is_premium) {
      return NextResponse.json({ 
        status: "free", 
        module: moduleInfo
      });
    }
    
    // Check if user has already purchased it
    const [purchases] = await connection.execute(
      `SELECT mp.purchase_id, mp.status, mp.purchase_date,
              pt.payment_id, pt.paymentStatus, pt.transaction_date
       FROM ModulePurchases mp
       JOIN PaymentTransactions pt ON mp.payment_id = pt.payment_id
       WHERE mp.user_id = ? AND mp.module_id = ?
       ORDER BY mp.purchase_date DESC
       LIMIT 1`,
      [userId, moduleId]
    );
    
    // If no purchase record exists
    if (purchases.length === 0) {
      return NextResponse.json({ 
        status: "not_purchased", 
        module: moduleInfo
      });
    }
    
    const purchase = purchases[0];
    
    // Return appropriate status based on purchase state
    if (purchase.paymentStatus === 'pending') {
      return NextResponse.json({
        status: "payment_pending",
        purchase: {
          ...purchase,
          module: moduleInfo
        }
      });
    } else if (purchase.paymentStatus === 'rejected') {
      return NextResponse.json({
        status: "payment_rejected",
        purchase: {
          ...purchase,
          module: moduleInfo
        }
      });    } else if (purchase.status === 'active') {
      return NextResponse.json({
        status: "active",
        purchase: {
          ...purchase,
          module: moduleInfo
        }
      });
    } else {
      return NextResponse.json({
        status: purchase.status,
        purchase: {
          ...purchase,
          module: moduleInfo
        }
      });
    }
    
  } catch (error) {
    console.error("Error checking module purchase status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check module purchase status" },
      { status: error.status || 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
