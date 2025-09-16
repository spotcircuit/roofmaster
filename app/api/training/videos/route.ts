import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    // Fetch from database
    let query = sql`
      SELECT
        v.id,
        v.title,
        v.description,
        v.video_url as "videoUrl",
        v.category,
        v.duration,
        CASE WHEN q.id IS NOT NULL THEN true ELSE false END as "hasQuiz",
        v.is_active as "isActive"
      FROM training_videos v
      LEFT JOIN video_quizzes q ON v.id = q.video_id
      WHERE v.is_active = true
    `;

    if (category !== 'all') {
      query = sql`
        SELECT
          v.id,
          v.title,
          v.description,
          v.video_url as "videoUrl",
          v.category,
          v.duration,
          CASE WHEN q.id IS NOT NULL THEN true ELSE false END as "hasQuiz",
          v.is_active as "isActive"
        FROM training_videos v
        LEFT JOIN video_quizzes q ON v.id = q.video_id
        WHERE v.is_active = true AND v.category = ${category}
      `;
    }

    const videos = await query;

    // Add completed status (would come from user_video_progress in real app)
    const videosWithProgress = videos.map(v => ({
      ...v,
      completed: false // This would be fetched from user_video_progress table
    }));

    return NextResponse.json({ videos: videosWithProgress });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}