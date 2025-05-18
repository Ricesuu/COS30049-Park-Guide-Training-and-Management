import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guide_id = searchParams.get('guide_id');

  if (!guide_id || isNaN(guide_id)) {
    return NextResponse.json(
      { error: 'Please provide valid guide id' },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    // 1. fetch park guide data
    const [guideInfo] = await connection.execute(
      `SELECT 
        pg.guide_id,
        u.first_name,
        u.last_name,
        u.email,
        pg.certification_status
      FROM ParkGuides pg
      JOIN Users u ON pg.user_id = u.user_id
      WHERE pg.guide_id = ?`,
      [guide_id]
    );

    if (guideInfo.length === 0) {
      return NextResponse.json(
        { error: 'Failed to find this park guide！' },
        { status: 404 }
      );
    }

    // 2. fetch feedback
    const [feedbacks] = await connection.execute(
      `SELECT * FROM VisitorFeedback
       WHERE guide_id = ?
       ORDER BY submitted_at DESC`,
      [guide_id]
    );

    // 3. calculate average rating
    const calculateAverage = (field) => {
      if (feedbacks.length === 0) return 0;
      return feedbacks.reduce((sum, f) => sum + f[field], 0) / feedbacks.length;
    };

    const language = calculateAverage('language_rating');
    const knowledge = calculateAverage('knowledge_rating');
    const organization = calculateAverage('organization_rating');
    const engagement = calculateAverage('engagement_rating');
    const safety = calculateAverage('safety_rating');

    const total = feedbacks.length > 0
      ? (language + knowledge + organization + engagement + safety) / 5
      : 0;

    const averages = {
      language,
      knowledge,
      organization,
      engagement,
      safety,
      total
    };

    // 4. return results
    return NextResponse.json({
      success: true,
      data: {
        guide_info: guideInfo[0],
        feedbacks,
        averages,
        feedback_count: feedbacks.length
      }
    });

  } catch (error) {
    console.error('Failed to fetch data:', error);
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
