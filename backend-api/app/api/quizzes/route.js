import { getAllQuizzes, createQuiz } from "@/controllers/quizController";
import { NextResponse } from "next/server";

// Handle preflight (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or restrict to your Vite frontend origin
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// GET /api/quizzes
export async function GET(req) {
  const response = await getAllQuizzes(req);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

// POST /api/quizzes
export async function POST(req) {
  const response = await createQuiz(req);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
