import {
  getCourseById,
  updateCourse,
  deleteCourse,
} from "@/controllers/courseController";
import { NextResponse } from "next/server";

// CORS headers (customize origin in production)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS /api/courses/:courseId - Preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/courses/:courseId
export async function GET(req, { params }) {
  const res = await getCourseById(req, params.courseId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// PUT /api/courses/:courseId
export async function PUT(req, { params }) {
  const res = await updateCourse(req, params.courseId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// DELETE /api/courses/:courseId
export async function DELETE(req, { params }) {
  const res = await deleteCourse(req, params.courseId);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
