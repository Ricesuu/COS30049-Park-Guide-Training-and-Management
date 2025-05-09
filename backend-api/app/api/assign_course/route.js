import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get('type');
  const connection = await getConnection();

  try {
    if (dataType === 'guides') {
      const [guides] = await connection.execute(`
        SELECT 
          pg.guide_id,
          u.first_name,
          u.last_name,
          u.email,
          pg.certification_status,
          GROUP_CONCAT(DISTINCT gtp.module_id) AS assigned_modules
        FROM ParkGuides pg
        JOIN Users u ON pg.user_id = u.user_id
        LEFT JOIN GuideTrainingProgress gtp ON pg.guide_id = gtp.guide_id
        WHERE pg.certification_status = 'pending'
        GROUP BY pg.guide_id
      `);

      const formattedGuides = guides.map(guide => ({
        ...guide,
        assigned_modules: guide.assigned_modules
          ? guide.assigned_modules.split(',').map(Number)
          : []
      }));

      return NextResponse.json(formattedGuides);
    }

    if (dataType === 'modules') {
      const [modules] = await connection.execute('SELECT * FROM TrainingModules');
      return NextResponse.json(modules);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function POST(request) {
  const body = await request.json();
  const { guide_id, module_ids } = body;

  if (!guide_id || !Array.isArray(module_ids)) {
    return NextResponse.json(
      { error: 'guide_id and module_ids are required!' },
      { status: 400 }
    );
  }

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `DELETE FROM GuideTrainingProgress 
       WHERE guide_id = ? AND status = 'in progress'`,
      [guide_id]
    );

    for (const module_id of module_ids) {
      await connection.execute(
        `INSERT INTO GuideTrainingProgress 
         (guide_id, module_id, status, completion_date) 
         VALUES (?, ?, 'in progress', NULL)`,
        [guide_id, module_id]
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: 'Modules successfully assigned!',
      guide_id,
      assigned_modules: module_ids
    });

  } catch (error) {
    await connection.rollback();
    console.error('Operation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Database operation error' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function DELETE(request) {
  const { guide_id } = await request.json();

  if (!guide_id || isNaN(guide_id)) {
    return NextResponse.json(
      { error: 'A valid guide_id is required!' },
      { status: 400 }
    );
  }

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `DELETE FROM GuideTrainingProgress 
       WHERE guide_id = ? AND status = 'in progress'`,
      [guide_id]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: 'Successfully deleted all in-progress module assignments!',
      guide_id
    });

  } catch (error) {
    await connection.rollback();
    console.error('Failed to delete modules:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting modules' },
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
