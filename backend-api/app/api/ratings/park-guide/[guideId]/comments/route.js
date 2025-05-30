// app/api/ratings/park-guide/self/comments/route.js

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

    // Step 1: Get user_id
    const [[userRow]] = await connection.execute(
      `SELECT user_id FROM Users WHERE uid = ?`,
      [firebaseUid]
    );
    if (!userRow) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = userRow.user_id;

    // Step 2: Get guide_id
    const [[guideRow]] = await connection.execute(
      `SELECT guide_id FROM ParkGuides WHERE user_id = ?`,
      [userId]
    );
    if (!guideRow) return NextResponse.json({ error: "Park guide not found" }, { status: 404 });

    const guideId = guideRow.guide_id;

    // Step 3: Get recent comments
    const [comments] = await connection.execute(
      `
      SELECT comment, submitted_at 
      FROM visitorfeedback
      WHERE guide_id = ? AND comment IS NOT NULL
      ORDER BY submitted_at DESC
      LIMIT 10
      `,
      [guideId]
    );

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Comment fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
