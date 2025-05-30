import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function POST(request) {
    let connection;
    try {
        const auth = await getAuth(request);
        if (!auth.isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = auth.user.id;
        const { moduleId, answers, passingScore = 0.7 } = await request.json();

        if (!moduleId || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { error: "Missing or invalid moduleId or answers" },
                { status: 400 }
            );
        }

        connection = await getConnection();

        // Step 0: Get quiz_id from trainingmodules
        const [[moduleRow]] = await connection.execute(
            "SELECT quiz_id FROM trainingmodules WHERE module_id = ?",
            [moduleId]
        );
        const quizId = moduleRow?.quiz_id;

        if (!quizId) {
            return NextResponse.json({ error: "Quiz not found for module" }, { status: 404 });
        }

        // Step 1: Get correct answers
        const [rows] = await connection.execute(
            `SELECT o.question_id, o.options_id AS correct_option_id
             FROM options o
             JOIN questions q ON o.question_id = q.question_id
             WHERE q.quiz_id = ? AND o.is_correct = 1`,
            [quizId]
        );

        const correctMap = new Map();
        for (const row of rows) {
            correctMap.set(row.question_id, row.correct_option_id);
        }

        // Step 2: Score calculation
        let score = 0;
        for (const ans of answers) {
            const correct = correctMap.get(ans.questionId);
            if (correct && correct === ans.selectedOptionId) {
                score++;
            }
        }

        const totalQuestions = correctMap.size;
        const passPercentage = score / totalQuestions;
        const passed = passPercentage >= passingScore;

        // Step 3: Transaction
        await connection.beginTransaction();

        try {
            await connection.execute(                `INSERT INTO quizattempts
                 (quiz_id, user_id, guide_id, module_id, score, passed, totalquestions, start_time, end_time, attempt_number)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 
                    (SELECT COALESCE(MAX(attempt_number), 0) + 1 
                     FROM quizattempts AS qa 
                     WHERE qa.user_id = ? AND qa.module_id = ?))`,
                [quizId, userId, guide_id, moduleId, score, passed ? 1 : 0, totalQuestions, userId, moduleId]
            );

            if (passed) {

                const [existingCerts] = await connection.execute(
                    `SELECT cert_id FROM Certifications 
                     WHERE guide_id = ? AND module_id = ?`,
                    [userId, moduleId]
                );

                if (existingCerts.length === 0) {
                    const today = new Date();
                    const expiryDate = new Date(today);
                    expiryDate.setFullYear(today.getFullYear() + 1);

                    await connection.execute(
                        `INSERT INTO Certifications 
                         (guide_id, module_id, issued_date, expiry_date) 
                         VALUES (?, ?, CURDATE(), ?)`,
                        [userId, moduleId, expiryDate.toISOString().split('T')[0]]
                    );

                    console.log(`Created new certification for user ${userId}, module ${moduleId}`);
                }
            }

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
            await connection.rollback();
            throw error;
        }
    } catch (error) {        console.error("Error recording quiz attempt:", error);
        return NextResponse.json(
            { error: "Failed to record quiz attempt", details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function GET(request) {
    let connection;
    try {
        const auth = await getAuth(request);
        if (!auth.isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = auth.user.id;
        const url = new URL(request.url);
        const moduleId = url.searchParams.get("moduleId");

        connection = await getConnection();        let query = `
            SELECT 
                qa.attempt_id,
                qa.quiz_id,
                qa.module_id,
                qa.score,
                qa.totalquestions,
                qa.passed,
                qa.start_time,
                qa.end_time,
                qa.attempt_number,
                tm.module_name
            FROM 
                quizattempts qa
            JOIN 
                TrainingModules tm ON qa.module_id = tm.module_id
            WHERE 
                qa.user_id = ?`;

        const params = [userId];

        if (moduleId) {            query += ` AND qa.module_id = ?`;
            params.push(moduleId);
        }

        query += ` ORDER BY qa.end_time DESC, qa.attempt_number DESC`;

        const [rows] = await connection.execute(query, params);
        return NextResponse.json(rows);
    } catch (error) {        console.error("Error fetching quiz attempts:", error);
        return NextResponse.json({ error: "Failed to fetch quiz attempts" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
