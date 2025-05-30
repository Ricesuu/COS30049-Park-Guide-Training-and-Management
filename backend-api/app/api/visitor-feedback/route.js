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
      guideId,
      languageRating,
      knowledgeRating,
      organizationRating,
      engagementRating,
      safetyRating,
      feedback
    } = body;

    console.log('Received feedback submission:', body);

    // Validate required fields
    const requiredFields = {
      firstName,
      lastName,
      email,
      ticketNo,
      park,
      visitDate,
      guideId,
      languageRating,
      knowledgeRating,
      organizationRating,
      engagementRating,
      safetyRating
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Connect to database
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
                guide_id,
                language_rating,
                knowledge_rating,
                organization_rating,
                engagement_rating,
                safety_rating,
                comment
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        telephone,
        email,
        ticketNo,
        park,
        visitDate,
        guideId,
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
