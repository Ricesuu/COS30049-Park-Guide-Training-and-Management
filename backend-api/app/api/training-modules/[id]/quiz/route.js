import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { assertUser } from "@/lib/assertUser";

// GET quiz for a module
export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = await Promise.resolve(params);
    const moduleId = id;

    const { uid, role } = await assertUser(request, ["admin", "park_guide"]);

    connection = await getConnection();

    // Get user ID
    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE uid = ?",
      [uid]
    );
    if (!userRows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = userRows[0].user_id;

    // Check access (free or purchased)
    const [accessRows] = await connection.execute(
      `
      SELECT CASE
        WHEN tm.price = 0 THEN TRUE
        WHEN mp.purchase_id IS NOT NULL AND mp.status = 'active' THEN TRUE
        ELSE FALSE
      END AS has_access
      FROM trainingmodules tm
      LEFT JOIN modulepurchases mp
        ON tm.module_id = mp.module_id
        AND mp.user_id = ? AND mp.status = 'active' AND mp.is_active = 1
      WHERE tm.module_id = ?
      `,
      [userId, moduleId]
    );

    if (!accessRows.length || !accessRows[0].has_access) {
      return NextResponse.json(
        { error: "Access denied. Please purchase this module first." },
        { status: 403 }
      );
    }    // Fetch module and its associated quiz info
    console.log("Fetching quiz info for module:", moduleId);
    const [modRows] = await connection.execute(
      `      SELECT 
        tm.module_id, 
        tm.quiz_id,
        tm.module_name,
        q.quiz_id,
        q.name AS quiz_name,
        q.description AS quiz_description,
        CASE 
          WHEN q.quiz_id IS NULL THEN FALSE
          ELSE TRUE
        END as has_quiz
      FROM TrainingModules tm
      LEFT JOIN quizzes q ON tm.quiz_id = q.quiz_id
      WHERE tm.module_id = ?
      `,
      [moduleId]
    );
    
    console.log("Module and quiz query result:", modRows);
    
    if (!modRows.length) {
      console.log("No module found for id:", moduleId);
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }
      if (!modRows[0].has_quiz) {
      console.log("No valid quiz found for module:", moduleId);
      return NextResponse.json(
        { error: "No quiz available for this module." },
        { status: 404 }
      );
    }
    
    console.log("Found quiz:", modRows[0].quiz_name, "for module:", modRows[0].module_name);    const quizId = modRows[0].quiz_id;
    const quizInfo = {
      quiz_id: modRows[0].quiz_id,
      title: modRows[0].quiz_name,
      description: modRows[0].quiz_description,
      has_quiz: modRows[0].has_quiz
    };

    // Get user's previous attempts
    const [attemptStats] = await connection.execute(
      `
      SELECT COUNT(*) AS attempt_count, MAX(attempt_number) AS last_attempt
      FROM quizattempts
      WHERE quiz_id = ? AND user_id = ? AND module_id = ?
      `,
      [quizId, userId, moduleId]
    );    const attemptsUsed = Number(attemptStats[0].attempt_count || 0);
    const lastAttempt = Number(attemptStats[0].last_attempt || 0);
    const maxAttempts = 999999; // Effectively unlimited attempts    // Load questions and options
    const [questions] = await connection.execute(
      `
      SELECT q.question_id, q.type AS question_type, q.text AS question_text, q.points,
             o.options_id AS option_id, o.text AS option_text
      FROM questions q
      LEFT JOIN options o ON q.question_id = o.question_id
      WHERE q.quiz_id = ?
      ORDER BY q.question_id, o.options_id
      `,
      [quizId]
    );

    // Process the flat results into a structured format with questions and their options
    const processedQuestions = [];
    let currentQuestion = null;

    for (const row of questions) {
      if (!currentQuestion || currentQuestion.question_id !== row.question_id) {
        currentQuestion = {
          question_id: row.question_id,
          question_type: row.question_type,
          question_text: row.question_text,
          points: row.points,
          options: []
        };
        processedQuestions.push(currentQuestion);
      }
      
      if (row.option_id) {
        currentQuestion.options.push({
          option_id: row.option_id,
          option_text: row.option_text
        });
      }    }
    
    return NextResponse.json({
      quiz: {
        id: quizInfo.quiz_id,
        title: quizInfo.title,
        description: quizInfo.description,        attemptsAllowed: maxAttempts,
        attemptsUsed,
        nextAttemptNumber: lastAttempt + 1
      },
      questions: processedQuestions
    });

  } catch (err) {
    console.error("GET quiz error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (connection) connection?.release();
  }
}

// POST submission of quiz
export async function POST(request, { params }) {
  let connection;
  try {
    const { id } = await Promise.resolve(params);
    const moduleId = id;
    const { answers, attemptId } = await request.json();

    if (!Array.isArray(answers) || !attemptId) {
      return NextResponse.json(
        { error: "Invalid submission: answers array and attemptId required" },
        { status: 400 }
      );
    }

    const { uid } = await assertUser(request, ["admin", "park_guide"]);

    connection = await getConnection();

    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE uid = ?",
      [uid]
    );
    if (!userRows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = userRows[0].user_id;

    // Verify this attempt belongs to the user
    const [attemptCheck] = await connection.execute(
      `
      SELECT quiz_id
      FROM quizattempts
      WHERE attempt_id = ? AND user_id = ? AND module_id = ?
      `,
      [attemptId, userId, moduleId]
    );
    if (!attemptCheck.length) {
      return NextResponse.json(
        { error: "Invalid quiz attempt" },
        { status: 403 }
      );
    }
    const quizId = attemptCheck[0].quiz_id;

    // Calculate score
    let totalPoints = 0, earnedPoints = 0;
    const [allQs] = await connection.execute(
      `
      SELECT question_id, points
      FROM questions
      WHERE quiz_id = ?
      `,
      [quizId]
    );

    for (const q of allQs) {
      totalPoints += q.points;
      const uAns = answers.find(a => a.questionId === q.question_id);
      if (uAns) {
        const [correct] = await connection.execute(
          `
          SELECT options_id
          FROM options
          WHERE question_id = ? AND is_correct = 1
          LIMIT 1
          `,
          [q.question_id]
        );
        if (correct.length && uAns.selectedOptionId === correct[0].options_id) {
          earnedPoints += q.points;
        }
      }
    }

    const scorePercent = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = scorePercent >= 70; // or your threshold

    await connection.execute(
      `
      UPDATE quizattempts
      SET end_time = NOW(), score = ?, passed = ?
      WHERE attempt_id = ?
      `,
      [scorePercent, passed ? 1 : 0, attemptId]
    );

    // If passed, update progress and purchase
    if (passed) {
      await connection.execute(
        `
        INSERT INTO GuideTrainingProgress (guide_id, module_id, status, completion_date)
        VALUES (
          (SELECT guide_id FROM parkguides WHERE user_id = ? LIMIT 1),
          ?, 'Completed', CURDATE()
        )
        ON DUPLICATE KEY UPDATE status='Completed', completion_date=CURDATE()
        `,
        [userId, moduleId]
      );
      await connection.execute(
        `
        UPDATE modulepurchases
        SET completion_percentage = 100.00
        WHERE user_id = ? AND module_id = ?
        `,
        [userId, moduleId]
      );
    }

    return NextResponse.json({
      score: scorePercent,
      totalPoints,
      earnedPoints,
      passed,
      message: passed
        ? "Congratulations! You passed."
        : "You did not pass. Review content and try again."
    });

  } catch (err) {
    console.error("POST quiz error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (connection) connection?.release();
  }
}
