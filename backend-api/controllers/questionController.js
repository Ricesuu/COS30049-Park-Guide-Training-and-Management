import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🔹 Get all questions for a quiz
export async function getQuizQuestions(req, quizId) {
    try {
        const conn = await getConnection();

        const [questions] = await conn.query(
            "SELECT * FROM questions WHERE quiz_id = ? ORDER BY question_id",
            [quizId]
        );

        if (questions.length === 0) {
            conn.release();
            return NextResponse.json([]);
        }

        const questionIds = questions.map((q) => q.question_id);
        const [options] = await conn.query(
            "SELECT * FROM options WHERE question_id IN (?) ORDER BY question_id",
            [questionIds]
        );

        conn.release();

        const questionsWithOptions = questions.map((question) => ({
            ...question,
            options: options.filter(
                (opt) => opt.question_id === question.question_id
            ),
        }));

        return NextResponse.json(questionsWithOptions);
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        const errorMessage =
            error.code === "ER_NO_SUCH_TABLE"
                ? "Database table 'questions' or 'options' not found"
                : error.code === "ER_BAD_FIELD_ERROR"
                ? "Invalid column name in database query"
                : `Failed to fetch quiz questions: ${error.message}`;
        return NextResponse.json(
            { message: errorMessage, error: error.message },
            { status: 500 }
        );
    }
}

// 🔹 Get a single question by ID
export async function getQuestionById(req, id) {
    try {
        const conn = await getConnection();

        const [questions] = await conn.query(
            "SELECT * FROM questions WHERE question_id = ?",
            [id]
        );

        if (questions.length === 0) {
            conn.release();
            return NextResponse.json(
                { message: "Question not found" },
                { status: 404 }
            );
        }

        const [options] = await conn.query(
            "SELECT * FROM options WHERE question_id = ?",
            [id]
        );

        conn.release();
        return NextResponse.json({ ...questions[0], options });
    } catch (error) {
        console.error("Error fetching question:", error);
        const errorMessage =
            error.code === "ER_NO_SUCH_TABLE"
                ? "Database table 'questions' not found"
                : error.code === "ER_BAD_FIELD_ERROR"
                ? "Invalid question field in database query"
                : `Failed to fetch question: ${error.message}`;
        return NextResponse.json(
            { message: errorMessage, error: error.message },
            { status: 500 }
        );
    }
}

// 🔹 Create a new question
export async function createQuestion(req, quizId) {
    const { type, text, explanation, points, options } = await req.json();

    if (!text || !type) {
        return NextResponse.json(
            { message: "Question text and type are required" },
            { status: 400 }
        );
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
        return NextResponse.json(
            { message: "Question options are required" },
            { status: 400 }
        );
    }

    if (type === "multiple-choice" && !options.some((opt) => opt.isCorrect)) {
        return NextResponse.json(
            { message: "At least one correct option is required" },
            { status: 400 }
        );
    }

    const conn = await getConnection();
    try {
        await conn.beginTransaction();

        const [questionResult] = await conn.query(
            "INSERT INTO questions (quiz_id, type, text, explanation, points) VALUES (?, ?, ?, ?, ?)",
            [quizId, type, text, explanation || "", points || 1]
        );

        const questionId = questionResult.insertId;

        for (const option of options) {
            await conn.query(
                "INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)",
                [questionId, option.text, option.isCorrect ? 1 : 0]
            );
        }

        await conn.commit();

        const [questions] = await conn.query(
            "SELECT * FROM questions WHERE questions_id = ?",
            [questionId]
        );
        const [insertedOptions] = await conn.query(
            "SELECT * FROM options WHERE question_id = ?",
            [questionId]
        );

        return NextResponse.json(
            { ...questions[0], options: insertedOptions },
            { status: 201 }
        );
    } catch (error) {
        await conn.rollback();
        console.error("Error creating question:", error);
        const errorMessage =
            error.code === "ER_NO_REFERENCED_ROW_2"
                ? "The specified quiz ID does not exist"
                : error.code === "ER_DUP_ENTRY"
                ? "A question with this content already exists"
                : error.code === "ER_BAD_NULL_ERROR"
                ? "Required question fields are missing"
                : error.code === "ER_NO_SUCH_TABLE"
                ? "Database table 'questions' or 'options' not found"
                : `Failed to create question: ${error.message}`;
        return NextResponse.json(
            { message: errorMessage, error: error.message },
            { status: 500 }
        );
    } finally {
        conn.release();
    }
}

// 🔹 Update a question
export async function updateQuestion(req, id) {
    const { type, text, explanation, points, options } = await req.json();

    if (!text || !type) {
        return NextResponse.json(
            { message: "Question text and type are required" },
            { status: 400 }
        );
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
        return NextResponse.json(
            { message: "Question options are required" },
            { status: 400 }
        );
    }

    const conn = await getConnection();
    try {
        await conn.beginTransaction();

        const [updateResult] = await conn.query(
            "UPDATE questions SET type = ?, text = ?, explanation = ?, points = ? WHERE question_id = ?",
            [type, text, explanation || "", points || 1, id]
        );

        if (updateResult.affectedRows === 0) {
            await conn.rollback();
            return NextResponse.json(
                { message: "Question not found" },
                { status: 404 }
            );
        }

        await conn.query("DELETE FROM options WHERE question_id = ?", [id]);

        for (const option of options) {
            await conn.query(
                "INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)",
                [id, option.text, option.isCorrect ? 1 : 0]
            );
        }

        await conn.commit();

        const [questions] = await conn.query(
            "SELECT * FROM questions WHERE question_id = ?",
            [id]
        );
        const [updatedOptions] = await conn.query(
            "SELECT * FROM options WHERE question_id = ?",
            [id]
        );

        return NextResponse.json({ ...questions[0], options: updatedOptions });
    } catch (error) {
        await conn.rollback();
        console.error("Error updating question:", error);
        const errorMessage =
            error.code === "ER_NO_SUCH_TABLE"
                ? "Database table 'questions' or 'options' not found"
                : error.code === "ER_DUP_ENTRY"
                ? "A question with this content already exists"
                : error.code === "ER_BAD_NULL_ERROR"
                ? "Required question fields are missing"
                : error.code === "ER_NO_REFERENCED_ROW"
                ? "The question does not exist"
                : `Failed to update question: ${error.message}`;
        return NextResponse.json(
            { message: errorMessage, error: error.message },
            { status: 500 }
        );
    } finally {
        conn.release();
    }
}

// 🔹 Delete a question
export async function deleteQuestion(req, id) {
    try {
        const conn = await getConnection();
        const [result] = await conn.query(
            "DELETE FROM questions WHERE id = ?",
            [id]
        );
        conn.release();

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "Question not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        const errorMessage =
            error.code === "ER_NO_SUCH_TABLE"
                ? "Database table 'questions' not found"
                : error.code === "ER_ROW_IS_REFERENCED"
                ? "Cannot delete question - it is referenced by other data"
                : error.code === "ER_NO_REFERENCED_ROW"
                ? "The question does not exist"
                : `Failed to delete question: ${error.message}`;
        return NextResponse.json(
            { message: errorMessage, error: error.message },
            { status: 500 }
        );
    }
}

// 🔹 Duplicate a question
export async function duplicateQuestion(req, id) {
    const conn = await getConnection();
    try {
        await conn.beginTransaction();

        const [questions] = await conn.query(
            "SELECT * FROM questions WHERE question_id = ?",
            [id]
        );

        if (questions.length === 0) {
            await conn.rollback();
            return NextResponse.json(
                { message: "Question not found" },
                { status: 404 }
            );
        }

        const question = questions[0];

        const [duplicateResult] = await conn.query(
            "INSERT INTO questions (quiz_id, type, text, explanation, points) VALUES (?, ?, ?, ?, ?)",
            [
                question.quiz_id,
                question.type,
                `${question.text} (copy)`,
                question.explanation,
                question.points,
            ]
        );

        const newQuestionId = duplicateResult.insertId;

        const [options] = await conn.query(
            "SELECT * FROM options WHERE question_id = ?",
            [id]
        );

        for (const option of options) {
            await conn.query(
                "INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)",
                [newQuestionId, option.text, option.is_correct]
            );
        }

        await conn.commit();

        const [newQuestions] = await conn.query(
            "SELECT * FROM questions WHERE question_id = ?",
            [newQuestionId]
        );
        const [newOptions] = await conn.query(
            "SELECT * FROM options WHERE question_id = ?",
            [newQuestionId]
        );

        return NextResponse.json(
            { ...newQuestions[0], options: newOptions },
            { status: 201 }
        );
    } catch (error) {
        await conn.rollback();
        console.error("Error duplicating question:", error);
        const errorMessage =
            error.code === "ER_NO_SUCH_TABLE"
                ? "Database table 'questions' or 'options' not found"
                : error.code === "ER_DUP_ENTRY"
                ? "Failed to create duplicate - a question with this content already exists"
                : error.code === "ER_NO_REFERENCED_ROW"
                ? "The original question does not exist"
                : `Failed to duplicate question: ${error.message}`;
        return NextResponse.json(
            { message: errorMessage, error: error.message },
            { status: 500 }
        );
    } finally {
        conn.release();
    }
}
