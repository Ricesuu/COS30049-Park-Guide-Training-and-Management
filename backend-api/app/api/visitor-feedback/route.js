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
      firstName,
      lastName,
      telephone,
      email,
      ticketNo,
      park,
      visitDate,
      guideName,
      guideNumber,
      languageRating,
      knowledgeRating,
      organizationRating,
      engagementRating,
      safetyRating,
      feedback
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !ticketNo || !park || !visitDate || 
        !guideName || !guideNumber || !languageRating || !knowledgeRating || 
        !organizationRating || !engagementRating || !safetyRating) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    connection = await getConnection();
    const [result] = await connection.execute(
      `INSERT INTO visitorfeedback (
                first_name,
                last_name,
                telephone,
                email,
                ticket_no,
                park,
                visit_date,
                guide_name,
                guide_number,
                language_rating,
                knowledge_rating,
                organization_rating,
                engagement_rating,
                safety_rating,
                comment
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        telephone,
        email,
        ticketNo,
        park,
        visitDate,
        guideName,
        guideNumber,
        languageRating,
        knowledgeRating,
        organizationRating,
        engagementRating,
        safetyRating,
        feedback
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
