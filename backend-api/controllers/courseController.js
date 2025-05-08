import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// Get all courses
export async function getAllCourses(req) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT m.module_id, m.module_code, m.module_name, m.description, 
             m.difficulty, m.aspect, m.video_url, m.course_content, 
             m.quiz_id, m.created_at, q.name as quiz_name
      FROM TrainingModules m
      LEFT JOIN quizzes q ON m.quiz_id = q.id
      ORDER BY m.created_at DESC
    `);
    conn.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Get a single course by ID
export async function getCourseById(req, id) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT m.*, q.name as quiz_name 
      FROM TrainingModules m
      LEFT JOIN quizzes q ON m.quiz_id = q.id
      WHERE m.module_id = ?
    `, [id]);
    conn.release();

    if (rows.length === 0) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Create a new course
export async function createCourse(req) {
  const {
    module_code, module_name, description,
    difficulty, aspect, video_url, course_content, quiz_id
  } = await req.json();

  if (!module_name || !module_code) {
    return NextResponse.json({ message: "Course name and code are required" }, { status: 400 });
  }

  try {
    const conn = await getConnection();
    const [result] = await conn.query(`
      INSERT INTO TrainingModules 
      (module_code, module_name, description, difficulty, aspect, video_url, course_content, quiz_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        module_code, module_name, description || "", difficulty || "beginner",
        aspect || "", video_url || "", course_content || "", quiz_id || null
      ]
    );
    conn.release();

    const newCourse = {
      module_id: result.insertId,
      module_code,
      module_name,
      description,
      difficulty,
      aspect,
      video_url,
      course_content,
      quiz_id,
      created_at: new Date()
    };

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Update a course
export async function updateCourse(req, id) {
  const {
    module_code, module_name, description,
    difficulty, aspect, video_url, course_content, quiz_id
  } = await req.json();

  if (!module_name || !module_code) {
    return NextResponse.json({ message: "Course name and code are required" }, { status: 400 });
  }

  try {
    const conn = await getConnection();

    const [result] = await conn.query(`
      UPDATE TrainingModules 
      SET module_code = ?, module_name = ?, description = ?, 
          difficulty = ?, aspect = ?, video_url = ?, course_content = ?, quiz_id = ?
      WHERE module_id = ?`,
      [
        module_code, module_name, description || "", difficulty || "beginner",
        aspect || "", video_url || "", course_content || "", quiz_id || null, id
      ]
    );

    if (result.affectedRows === 0) {
      conn.release();
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const [updatedCourse] = await conn.query(`
      SELECT m.*, q.name as quiz_name 
      FROM TrainingModules m
      LEFT JOIN quizzes q ON m.quiz_id = q.id
      WHERE m.module_id = ?`,
      [id]
    );

    conn.release();
    return NextResponse.json(updatedCourse[0]);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// Delete a course
export async function deleteCourse(req, id) {
  try {
    const conn = await getConnection();
    const [result] = await conn.query("DELETE FROM TrainingModules WHERE module_id = ?", [id]);
    conn.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
