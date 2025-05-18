// app/api/training-modules/[id]/quiz/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// GET quiz questions for a specific module
export async function GET(request, { params }) {
    let connection;
    try {
        const moduleId = params.id;
        
        // Authenticate the user
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
        }

        const userId = userRows[0].user_id;

        // Check if user has access to this module (either free or purchased)
        const [accessCheck] = await connection.execute(`
            SELECT 
                CASE 
                    WHEN tm.is_premium = FALSE THEN TRUE
                    WHEN mp.purchase_id IS NOT NULL AND mp.status = 'active' THEN TRUE
                    ELSE FALSE
                END AS has_access
            FROM TrainingModules tm
            LEFT JOIN ModulePurchases mp ON tm.module_id = mp.module_id 
                AND mp.user_id = ? AND mp.status = 'active' AND mp.is_active = TRUE
            WHERE tm.module_id = ?
        `, [userId, moduleId]);

        if (accessCheck.length === 0 || !accessCheck[0].has_access) {
            return NextResponse.json(
                { error: "Access denied. You must purchase this module first." },
                { status: 403 }
            );
        }

        // Check if a quiz exists for this module
        const [quizRows] = await connection.execute(`
            SELECT quiz_id, title, description, pass_percentage, attempts_allowed
            FROM Quizzes
            WHERE module_id = ?
            LIMIT 1
        `, [moduleId]);

        if (quizRows.length === 0) {
            return NextResponse.json(
                { error: "No quiz available for this module" },
                { status: 404 }
            );
        }

        const quizId = quizRows[0].quiz_id;

        // Get user's park guide id
        const [guideRows] = await connection.execute(
            "SELECT guide_id FROM ParkGuides WHERE user_id = ?",
            [userId]
        );
        
        const guideId = guideRows.length > 0 ? guideRows[0].guide_id : null;

        // Get number of attempts user has made
        const [attemptRows] = await connection.execute(`
            SELECT COUNT(*) as attempt_count, MAX(attempt_number) as last_attempt_number
            FROM QuizAttempts
            WHERE quiz_id = ? AND user_id = ?
        `, [quizId, userId]);

        const attemptCount = attemptRows[0].attempt_count || 0;
        const lastAttemptNumber = attemptRows[0].last_attempt_number || 0;
        const maxAttempts = quizRows[0].attempts_allowed;

        // Check if user has reached max attempts
        if (attemptCount >= maxAttempts) {
            return NextResponse.json(
                { 
                    error: "You have reached the maximum number of attempts for this quiz",
                    attemptsUsed: attemptCount,
                    maxAttempts: maxAttempts
                },
                { status: 403 }
            );
        }

        // Get quiz questions and answer options
        const [questionRows] = await connection.execute(`
            SELECT 
                q.question_id, 
                q.question_text, 
                q.question_type,
                q.points,
                q.sequence_number
            FROM QuizQuestions q
            WHERE q.quiz_id = ?
            ORDER BY q.sequence_number
        `, [quizId]);

        // For each question, get the answer options
        for (let i = 0; i < questionRows.length; i++) {
            const question = questionRows[i];
            
            // Only get options for multiple_choice and true_false questions
            if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
                const [optionRows] = await connection.execute(`
                    SELECT 
                        option_id, 
                        option_text,
                        sequence_number
                    FROM QuizAnswerOptions
                    WHERE question_id = ?
                    ORDER BY sequence_number
                `, [question.question_id]);
                
                question.options = optionRows;
            }
        }

        // Sanitize the output by removing the is_correct flag from options
        questionRows.forEach(question => {
            if (question.options) {
                question.options.forEach(option => {
                    delete option.is_correct;
                });
            }
        });

        // Create a new quiz attempt
        let attemptId = null;
        if (guideId) {
            const [attemptResult] = await connection.execute(`
                INSERT INTO QuizAttempts (quiz_id, user_id, guide_id, start_time, attempt_number)
                VALUES (?, ?, ?, NOW(), ?)
            `, [quizId, userId, guideId, lastAttemptNumber + 1]);
            
            attemptId = attemptResult.insertId;
        }

        return NextResponse.json({
            quiz: {
                id: quizId,
                title: quizRows[0].title,
                description: quizRows[0].description,
                passPercentage: quizRows[0].pass_percentage,
                attemptsAllowed: maxAttempts,
                attemptsUsed: attemptCount,
                nextAttemptNumber: lastAttemptNumber + 1,
                attemptId: attemptId
            },
            questions: questionRows
        });
    } catch (error) {
        console.error("Error fetching module quiz:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch module quiz" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// POST submit quiz answers
export async function POST(request, { params }) {
    let connection;
    try {
        const moduleId = params.id;
        const body = await request.json();
        const { answers, attemptId } = body;
        
        if (!answers || !Array.isArray(answers) || !attemptId) {
            return NextResponse.json(
                { error: "Invalid quiz submission. Answers array and attemptId required." },
                { status: 400 }
            );
        }
        
        // Authenticate the user
        const { uid, role } = await assertUser(request, ["admin", "park_guide"]);

        // Get user info
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
        }

        const userId = userRows[0].user_id;
        
        // Verify this is the user's attempt
        const [attemptCheck] = await connection.execute(`
            SELECT quiz_id, attempt_number
            FROM QuizAttempts
            WHERE attempt_id = ? AND user_id = ?
        `, [attemptId, userId]);
        
        if (attemptCheck.length === 0) {
            return NextResponse.json(
                { error: "Invalid quiz attempt" },
                { status: 403 }
            );
        }
        
        const quizId = attemptCheck[0].quiz_id;
        
        // Get quiz info including passing percentage
        const [quizInfo] = await connection.execute(`
            SELECT q.pass_percentage, q.module_id
            FROM Quizzes q
            WHERE q.quiz_id = ?
        `, [quizId]);
        
        if (quizInfo.length === 0) {
            return NextResponse.json(
                { error: "Quiz not found" },
                { status: 404 }
            );
        }
        
        // Verify the module ID matches
        if (parseInt(moduleId) !== quizInfo[0].module_id) {
            return NextResponse.json(
                { error: "Module ID mismatch" },
                { status: 400 }
            );
        }
        
        // Calculate score
        let totalPoints = 0;
        let earnedPoints = 0;
        
        // Get all questions and their correct answers
        const [questions] = await connection.execute(`
            SELECT 
                q.question_id, 
                q.points
            FROM QuizQuestions q
            WHERE q.quiz_id = ?
        `, [quizId]);
        
        // For each question, check if the user's answer is correct
        for (const question of questions) {
            totalPoints += question.points;
            
            // Find user's answer for this question
            const userAnswer = answers.find(a => a.questionId === question.question_id);
            
            if (userAnswer) {
                // Get correct answer
                const [correctOption] = await connection.execute(`
                    SELECT option_id
                    FROM QuizAnswerOptions
                    WHERE question_id = ? AND is_correct = TRUE
                    LIMIT 1
                `, [question.question_id]);
                
                if (correctOption.length > 0 && userAnswer.selectedOptionId === correctOption[0].option_id) {
                    earnedPoints += question.points;
                }
            }
        }
        
        // Calculate percentage
        const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const passed = scorePercentage >= quizInfo[0].pass_percentage;
        
        // Update the quiz attempt
        await connection.execute(`
            UPDATE QuizAttempts
            SET end_time = NOW(), score = ?, passed = ?
            WHERE attempt_id = ?
        `, [scorePercentage, passed ? 1 : 0, attemptId]);
        
        // If passed, update module completion
        if (passed) {
            // Get guide ID
            const [guideRows] = await connection.execute(
                "SELECT guide_id FROM ParkGuides WHERE user_id = ?",
                [userId]
            );
            
            if (guideRows.length > 0) {
                const guideId = guideRows[0].guide_id;
                
                // Update training progress to completed
                await connection.execute(`
                    INSERT INTO GuideTrainingProgress 
                    (guide_id, module_id, status, completion_date)
                    VALUES (?, ?, 'completed', CURDATE())
                    ON DUPLICATE KEY UPDATE
                    status = 'completed', completion_date = CURDATE()
                `, [guideId, moduleId]);
                
                // Update module purchase completion percentage
                await connection.execute(`
                    UPDATE ModulePurchases
                    SET completion_percentage = 100
                    WHERE user_id = ? AND module_id = ?
                `, [userId, moduleId]);
            }
        }
        
        return NextResponse.json({
            score: scorePercentage,
            totalPoints,
            earnedPoints,
            passed,
            passingThreshold: quizInfo[0].pass_percentage,
            message: passed ? 
                "Congratulations! You passed the quiz." : 
                "You did not pass. Please review the material and try again."
        });
    } catch (error) {
        console.error("Error processing quiz submission:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process quiz submission" },
            { status: error.status || 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
