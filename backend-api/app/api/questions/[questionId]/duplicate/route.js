import { duplicateQuestion } from "@/controllers/questionController";
import { NextResponse } from "next/server";

// CORS headers (adjust origin in production)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS /api/questions/:questionId/duplicate - Preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

// POST /api/questions/:questionId/duplicate - Duplicate a question
export async function POST(req, { params }) {
  const res = await duplicateQuestion(req, params.questionId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
