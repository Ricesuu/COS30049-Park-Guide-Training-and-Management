import {
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "@/controllers/quizController";
import { NextResponse } from "next/server";

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Use specific origin in production
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight (CORS) request
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/quizzes/:quizId
export async function GET(req, { params }) {
  const res = await getQuizById(req, params.quizId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// PUT /api/quizzes/:quizId
export async function PUT(req, { params }) {
  const res = await updateQuiz(req, params.quizId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// DELETE /api/quizzes/:quizId
export async function DELETE(req, { params }) {
  const res = await deleteQuiz(req, params.quizId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
