// app/api/visitor-feedback/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM VisitorFeedback");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching visitor feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor feedback" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const {
      guide_id,
      language_rating,
      knowledge_rating,
      organization_rating,
      engagement_rating,
      safety_rating,
      comment,
      visitor_name,
    } = body;

    connection = await getConnection();
    const [result] = await connection.execute(
      `INSERT INTO VisitorFeedback (
                guide_id, 
                language_rating, 
                knowledge_rating, 
                organization_rating, 
                engagement_rating, 
                safety_rating, 
                comment,
                visitor_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guide_id,
        language_rating || 0,
        knowledge_rating || 0,
        organization_rating || 0,
        engagement_rating || 0,
        safety_rating || 0,
        comment || "",
        visitor_name || "Anonymous Visitor",
      ]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        message: "Visitor feedback submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting visitor feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit visitor feedback" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
