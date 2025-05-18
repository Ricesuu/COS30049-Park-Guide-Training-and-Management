import {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "@/controllers/questionController";
import { NextResponse } from "next/server";

// ✅ CORS headers (adjust origin in production)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ OPTIONS /api/questions/:questionId - Preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

// ✅ GET /api/questions/:questionId
export async function GET(req, { params }) {
  const res = await getQuestionById(req, params.questionId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// ✅ PUT /api/questions/:questionId
export async function PUT(req, { params }) {
  const res = await updateQuestion(req, params.questionId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// ✅ DELETE /api/questions/:questionId
export async function DELETE(req, { params }) {
  const res = await deleteQuestion(req, params.questionId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
