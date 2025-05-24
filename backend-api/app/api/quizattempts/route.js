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
        }          const userId = auth.user.id;
        const { module_id, quiz_id, selectedAnswers, question_ids, answerTimes } = await request.json();

        if (!module_id || !quiz_id || !selectedAnswers || !question_ids) {
            return NextResponse.json(
                { error: "Missing required fields: module_id, quiz_id, selectedAnswers, and question_ids are required" },
                { status: 400 }
            );
        }

        connection = await getConnection();
        
        // Get the correct answers for each question from the options table
        const [optionsResults] = await connection.execute(
            `SELECT question_id, options_id 
             FROM options 
             WHERE question_id IN (?) AND is_correct = 1`,
            [question_ids]
        );

        // Create a map of question_id to correct option_id
        const correctAnswers = new Map(
            optionsResults.map(row => [row.question_id, row.options_id])
        );

        // Calculate score by comparing selected answers with correct answers
        let score = 0;
        let totalquestions = question_ids.length;
        question_ids.forEach((questionId, index) => {
            if (correctAnswers.get(questionId) === selectedAnswers[index]) {
                score++;
            }
        });

        // Calculate pass percentage
        const passPercentage = score / totalquestions;
        const passed = passPercentage >= 0.75; // 75% passing requirement
          // Get guide_id for the current user
        const [guideRows] = await connection.execute(
            "SELECT guide_id FROM parkguides WHERE user_id = ?",
            [userId]
        );
        
        if (!guideRows || guideRows.length === 0) {
            throw new Error('No guide record found for this user');
        }
        
        const guide_id = guideRows[0].guide_id;
        
        // Start a transaction
        await connection.beginTransaction();

        try {
            // Insert quiz attempt
            const [quizAttemptResult] = await connection.execute(
                `INSERT INTO quizattempts (quiz_id, user_id, guide_id, module_id, score, passed, totalquestions, start_time, end_time, attempt_number)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 
                    (SELECT COALESCE(MAX(attempt_number), 0) + 1 
                     FROM quizattempts AS qa 
                     WHERE qa.user_id = ? AND qa.module_id = ?))`,
                [quiz_id, userId, guide_id, module_id, score, passed ? 1 : 0, totalquestions, userId, module_id]
            );
            
            const attemptId = quizAttemptResult.insertId;

            // Insert quiz responses for each answer with proper tracking
            for (let i = 0; i < question_ids.length; i++) {                const isCorrect = selectedAnswers[i] === correctAnswers.get(question_ids[i]);
                const timeTaken = Array.isArray(answerTimes) ? (answerTimes[i] || 0) : 0;
                await connection.execute(
                    `INSERT INTO quizresponses (
                        attempt_id, 
                        question_id, 
                        selected_option_id, 
                        is_correct, 
                        time_taken,
                        answer_sequence,
                        created_at,
                        updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                    [
                        attemptId,
                        question_ids[i],
                        selectedAnswers[i],
                        isCorrect ? 1 : 0,
                        timeTaken,
                        i + 1  // answer_sequence is 1-based
                    ]
                );
            }

            // If quiz passed, check for certification
            if (passed) {
                // Check if a certification already exists
                const [existingCerts] = await connection.execute(
                    `SELECT cert_id FROM Certifications 
                     WHERE guide_id = ? AND module_id = ?`,
                    [userId, module_id]
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
                            [userId, module_id, expiryDate.toISOString().split('T')[0]]
                        );
                        
                        console.log(`Created new certification for user ${userId}, module ${module_id}`);
                    } catch (certError) {
                        console.error("Error creating certification:", certError);
                        // Continue with the transaction even if certificate creation fails
                    }
                } else {
                    console.log(`Certification already exists for user ${userId}, module ${module_id}`);
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
                totalQuestions: totalquestions,
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
        if (connection) {
            connection.release();
        }
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
