import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// Strict score level mapping table
const STRICT_SCORE_LEVEL_MAP = [
  { min: 0, max: 2.9, level: "beginner" },
  { min: 3, max: 3.9, level: "intermediate" },
  { min: 4, max: 5, level: "advanced" },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guide_id = searchParams.get("guide_id");
  if (!guide_id || isNaN(guide_id)) {
    const errorResponse = NextResponse.json(
      { error: "Please provide a valid guide ID!" },
      { status: 400 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }

  const connection = await getConnection();

  try {
    // 1. Get the average scores for the guide
    const [stats] = await connection.execute(
      `
      SELECT 
        COALESCE(AVG(language_rating), 0) as language,
        COALESCE(AVG(knowledge_rating), 0) as knowledge,
        COALESCE(AVG(organization_rating), 0) as organization,
        COALESCE(AVG(engagement_rating), 0) as engagement,
        COALESCE(AVG(safety_rating), 0) as safety,
        COUNT(*) as feedback_count
      FROM VisitorFeedback
      WHERE guide_id = ?
    `,
      [guide_id]
    ); // If there is no feedback data
    if (stats[0].feedback_count === 0) {
      const response = NextResponse.json({
        success: true,
        data: [],
        message: "Not enough feedback data to generate recommendations yet.",
      });
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }

    // 2. Get all training modules
    const [modules] = await connection.execute(`
      SELECT * FROM TrainingModules
      ORDER BY 
        FIELD(difficulty, 'beginner', 'intermediate', 'advanced'),
        module_name
    `);

    // 3. Generate recommendations based on strict match
    const recommendations = [
      "language",
      "knowledge",
      "organization",
      "engagement",
      "safety",
    ].map((aspect) => {
      const score = parseFloat(stats[0][aspect]) || 0;
      const level = STRICT_SCORE_LEVEL_MAP.find(
        (r) => score >= r.min && score <= r.max
      ).level;

      const recommendedModules = modules.filter(
        (module) => module.aspect === aspect && module.difficulty === level
      );

      return {
        aspect,
        score: parseFloat(score.toFixed(2)),
        level,
        feedbackCount: stats[0].feedback_count,
        modules: recommendedModules.slice(0, 3),
        hasRecommendations: recommendedModules.length > 0,
      };
    });
    const response = NextResponse.json({
      success: true,
      data: recommendations,
      meta: {
        generated_at: new Date().toISOString(),
        feedback_count: stats[0].feedback_count,
        hasAnyRecommendations: recommendations.some(
          (r) => r.modules.length > 0
        ),
      },
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("[Recommend System error]:", error);
    const errorResponse = NextResponse.json(
      {
        error: "The recommendation system is currently unavailable.",
        details: process.env.NODE_ENV === "development" ? error.message : null,
      },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  } finally {
    connection.release();
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
