import { getQuizQuestions, createQuestion } from "@/controllers/questionController";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS /api/quizzes/:quizId/questions - Preflight
export async function OPTIONS() {
  console.log("🛰️ OPTIONS request to /api/quizzes/[quizId]/questions");
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/quizzes/:quizId/questions
export async function GET(req, context) {
  const { quizId } = await context.params;
  console.log("📥 GET request to /api/quizzes/[quizId]/questions", { quizId });

  if (!quizId) {
    return NextResponse.json({ message: "Missing quizId in route params" }, { status: 400 });
  }

  const res = await getQuizQuestions(req, quizId);
  applyCORS(res);
  return res;
}

// POST /api/quizzes/:quizId/questions
export async function POST(req, context) {
  const { quizId } = await context.params;
  console.log("📤 POST request to /api/quizzes/[quizId]/questions", { quizId });

  if (!quizId) {
    return NextResponse.json({ message: "Missing quizId in route params" }, { status: 400 });
  }

  const res = await createQuestion(req, quizId);
  applyCORS(res);
  return res;
}

// Helper to apply CORS headers
function applyCORS(response) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
}
