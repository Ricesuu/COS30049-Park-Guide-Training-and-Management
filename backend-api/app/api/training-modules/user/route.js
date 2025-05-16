// app/api/training-modules/user/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// GET modules purchased by the current authenticated user
export async function GET(request) {
    let connection;
    try {
        // Authenticate the user (allow both admin and park_guide roles)
        const { uid, role } = await assertUser(request, ["admin", "park_guide"]);

        // Get user_id from the Users table based on the firebase uid
        connection = await getConnection();
        const [userRows] = await connection.execute(
            "SELECT user_id FROM Users WHERE uid = ?",
            [uid]
        );

        if (userRows.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }        const userId = userRows[0].user_id;            // Get the modules purchased by this user - show all modules regardless of payment status
        const [rows] = await connection.execute(`
            SELECT 
                tm.module_id AS id,
                tm.module_name AS name,
                tm.description,
                tm.duration,
                CONCAT('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/module-images/', tm.module_id, '.jpg') AS imageUrl,
                CONCAT('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/module-videos/', tm.module_id, '.mp4') AS videoUrl,
                mp.purchase_date,
                mp.completion_percentage,
                mp.status AS module_status,
                pt.paymentStatus,
                pt.payment_id,
                CASE WHEN pt.module_id IS NULL THEN mp.module_id ELSE pt.module_id END AS resolved_module_id
            FROM ModulePurchases mp
            JOIN TrainingModules tm ON mp.module_id = tm.module_id
            JOIN PaymentTransactions pt ON mp.payment_id = pt.payment_id
            WHERE mp.user_id = ? AND mp.is_active = TRUE
            ORDER BY mp.purchase_date DESC
        `, [userId]);

        // Check if we have any modules. If not, try to find any pending payments with module_id that might not have ModulePurchase records yet
        if (rows.length === 0) {
            console.log(`No module purchases found for user ${userId}. Checking for pending payments with modules...`);
            
            // Look for payment transactions with module_id but no corresponding ModulePurchases record
            const [pendingModules] = await connection.execute(`
                SELECT 
                    pt.payment_id,
                    pt.module_id AS id,
                    tm.module_name AS name,
                    tm.description,
                    tm.duration,
                    CONCAT('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/module-images/', pt.module_id, '.jpg') AS imageUrl,
                    CONCAT('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/module-videos/', pt.module_id, '.mp4') AS videoUrl,
                    pt.transaction_date AS purchase_date,
                    0 AS completion_percentage,
                    'pending' AS module_status,
                    pt.paymentStatus,
                    pt.payment_id
                FROM PaymentTransactions pt
                JOIN TrainingModules tm ON pt.module_id = tm.module_id
                LEFT JOIN ModulePurchases mp ON pt.payment_id = mp.payment_id
                WHERE pt.user_id = ? AND pt.module_id IS NOT NULL AND mp.purchase_id IS NULL
                ORDER BY pt.transaction_date DESC
            `, [userId]);
              if (pendingModules.length > 0) {                
                console.log(`Found ${pendingModules.length} pending payments with modules. Creating ModulePurchases records...`);
                
                // Create the missing ModulePurchases records
                for (const trainingModule of pendingModules) {
                    try {
                        await connection.execute(
                            `INSERT INTO ModulePurchases (user_id, module_id, payment_id, status)
                             VALUES (?, ?, ?, 'pending')`,
                            [userId, trainingModule.id, trainingModule.payment_id]
                        );
                        console.log(`Created ModulePurchases record for moduleId: ${trainingModule.id}, userId: ${userId}, paymentId: ${trainingModule.payment_id}`);
                    } catch (err) {
                        console.error(`Error creating ModulePurchases record:`, err);
                    }
                }
                
                // Fetch the modules again now that we've added the missing records
                return await getUserModules(req);
            }
        }

        // Add visual status indicators and access control
        const processedRows = rows.map(row => ({
            ...row,
            statusDisplay: row.paymentStatus === 'approved' ? 'Active' : 'Pending Approval',
            isAccessible: row.paymentStatus === 'approved'
        }));

        console.log(`Found ${processedRows.length} modules for user ${userId}`);
        
        return NextResponse.json(processedRows);
    } catch (error) {
        console.error("Error fetching user modules:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch user modules" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
