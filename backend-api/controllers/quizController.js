import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// Get all quizzes with question count
export async function getAllQuizzes(req) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT q.id, q.name, q.description, 
             COUNT(qn.id) AS questionCount, 
             q.created_at, q.updated_at
      FROM quizzes q
      LEFT JOIN questions qn ON q.id = qn.quiz_id
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `);
    conn.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Get a single quiz by ID
export async function getQuizById(req, id) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query("SELECT * FROM quizzes WHERE id = ?", [id]);

    if (rows.length === 0) {
      conn.release();
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const [countResult] = await conn.query(
      "SELECT COUNT(*) as questionCount FROM questions WHERE quiz_id = ?",
      [id]
    );

    conn.release();

    const quiz = {
      ...rows[0],
      questionCount: countResult[0].questionCount,
    };

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Create a new quiz
export async function createQuiz(req) {
  const body = await req.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ message: "Quiz name is required" }, { status: 400 });
  }

  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      "INSERT INTO quizzes (name, description) VALUES (?, ?)",
      [name, description || ""]
    );
    conn.release();

    const newQuiz = {
      id: result.insertId,
      name,
      description,
      questionCount: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Update a quiz
export async function updateQuiz(req, id) {
  const body = await req.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ message: "Quiz name is required" }, { status: 400 });
  }

  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      "UPDATE quizzes SET name = ?, description = ? WHERE id = ?",
      [name, description || "", id]
    );

    if (result.affectedRows === 0) {
      conn.release();
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const [updatedQuiz] = await conn.query("SELECT * FROM quizzes WHERE id = ?", [id]);
    conn.release();

    return NextResponse.json(updatedQuiz[0]);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Delete a quiz
export async function deleteQuiz(req, id) {
  try {
    const conn = await getConnection();
    const [result] = await conn.query("DELETE FROM quizzes WHERE id = ?", [id]);
    conn.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
