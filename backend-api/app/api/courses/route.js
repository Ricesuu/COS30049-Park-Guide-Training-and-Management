import { getAllCourses, createCourse } from "@/controllers/courseController";
import { NextResponse } from "next/server";

// CORS headers (adjust origin in production)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS /api/courses - Preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/courses - Fetch all courses
export async function GET(req) {
  const res = await getAllCourses(req);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// POST /api/courses - Create a new course
export async function POST(req) {
  const res = await createCourse(req);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
