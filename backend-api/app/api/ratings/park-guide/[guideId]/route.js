import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET(request) {
  const auth = await getAuth(request);
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firebaseUid = auth.user.uid;
  let connection;

  try {
    connection = await getConnection();

    // Step 1: Get user_id from Firebase UID
    const [[userRow]] = await connection.execute(
      `SELECT user_id FROM Users WHERE uid = ?`,
      [firebaseUid]
    );

    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRow.user_id;

    // Step 2: Get guide_id from user_id
    const [[guideRow]] = await connection.execute(
      `SELECT guide_id FROM ParkGuides WHERE user_id = ?`,
      [userId]
    );

    if (!guideRow) {
      return NextResponse.json({ error: "Park guide not found" }, { status: 404 });
    }

    const guideId = guideRow.guide_id;

    // Step 3: Fetch average rating for radar chart
    const [[result]] = await connection.execute(
      `
      SELECT 
        ROUND(AVG(language_rating), 1) AS language,
        ROUND(AVG(knowledge_rating), 1) AS knowledge,
        ROUND(AVG(organization_rating), 1) AS organization,
        ROUND(AVG(engagement_rating), 1) AS engagement,
        ROUND(AVG(safety_rating), 1) AS safety
      FROM visitorfeedback
      WHERE guide_id = ?
      `,
      [guideId]
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching guide ratings:", error);
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
  }
}
