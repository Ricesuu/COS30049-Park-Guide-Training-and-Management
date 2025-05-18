// app/api/quiz-completions/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function POST(request) {
    let connection;
    try {
        // Get the authenticated user
        const auth = await getAuth(request);
        if (!auth.isAuthenticated) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = auth.user.id;
        const { moduleId, score, totalQuestions, passingScore = 0.7 } = await request.json();

        if (!moduleId || score === undefined || !totalQuestions) {
            return NextResponse.json(
                { error: "Missing required fields: moduleId, score, and totalQuestions are required" },
                { status: 400 }
            );
        }

        // Calculate the pass percentage
        const passPercentage = score / totalQuestions;
        const passed = passPercentage >= passingScore;

        connection = await getConnection();
        
        // Start a transaction
        await connection.beginTransaction();

        try {
            // Record the quiz completion
            const [quizResult] = await connection.execute(
                `INSERT INTO QuizCompletions (user_id, module_id, score, total_questions, passed, completion_date)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [userId, moduleId, score, totalQuestions, passed ? 1 : 0]
            );

            // If quiz passed, update module completion status to 100%
            if (passed) {
                await connection.execute(
                    `UPDATE ModulePurchases 
                     SET completion_percentage = 100
                     WHERE user_id = ? AND module_id = ?`,
                    [userId, moduleId]
                );                // Check if a certification already exists
                const [existingCerts] = await connection.execute(
                    `SELECT cert_id FROM Certifications 
                     WHERE guide_id = ? AND module_id = ?`,
                    [userId, moduleId]
                );

                // Only create a new certificate if one doesn't exist
                if (existingCerts.length === 0) {
                    try {
                        // Calculate expiry date (1 year from now)
                        const today = new Date();
                        const expiryDate = new Date(today);
                        expiryDate.setFullYear(today.getFullYear() + 1);
                        
                        // Create a certification
                        await connection.execute(
                            `INSERT INTO Certifications (guide_id, module_id, issued_date, expiry_date)
                             VALUES (?, ?, CURDATE(), ?)`,
                            [userId, moduleId, expiryDate.toISOString().split('T')[0]]
                        );
                        
                        console.log(`Created new certification for user ${userId}, module ${moduleId}`);
                    } catch (certError) {
                        console.error("Error creating certification:", certError);
                        // Continue with the transaction even if certificate creation fails
                        // We don't want to roll back the quiz completion due to certificate issues
                    }
                } else {
                    console.log(`Certification already exists for user ${userId}, module ${moduleId}`);
                }
            }

            // Commit the transaction
            await connection.commit();

            return NextResponse.json({
                success: true,
                passed,
                message: passed 
                    ? "Congratulations! You passed the quiz and earned a certificate." 
                    : "You did not pass the quiz. Please try again.",
                score,
                totalQuestions,
                passPercentage: Math.round(passPercentage * 100)
            });
        } catch (error) {
            // If anything goes wrong, roll back the transaction
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        console.error("Error recording quiz completion:", error);
        return NextResponse.json(
            { error: "Failed to record quiz completion", details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function GET(request) {
    let connection;
    try {
        // Get the authenticated user
        const auth = await getAuth(request);
        if (!auth.isAuthenticated) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = auth.user.id;
        
        // Get module ID from query string if it exists
        const url = new URL(request.url);
        const moduleId = url.searchParams.get('moduleId');
        
        connection = await getConnection();
        
        let query = `
            SELECT 
                qc.quiz_id,
                qc.module_id,
                qc.score,
                qc.total_questions,
                qc.passed,
                qc.completion_date,
                tm.module_name
            FROM 
                QuizCompletions qc
            JOIN 
                TrainingModules tm ON qc.module_id = tm.module_id
            WHERE 
                qc.user_id = ?
        `;
        
        const params = [userId];
        
        // If module ID provided, filter by it
        if (moduleId) {
            query += " AND qc.module_id = ?";
            params.push(moduleId);
        }
        
        query += " ORDER BY qc.completion_date DESC";
        
        const [rows] = await connection.execute(query, params);
        
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching quiz completions:", error);
        return NextResponse.json(
            { error: "Failed to fetch quiz completions" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
