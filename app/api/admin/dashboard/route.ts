import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    // Initialize default values in case some tables don't exist yet
    let totalUsers = 0;
    let activeUsers = 0;
    let totalVideos = 0;
    let totalQuizzes = 0;
    let averageComprehension = 0;
    let completionRate = 0;
    let recentActivity: any[] = [];

    try {
      // Get total users count
      const totalUsersResult = await sql`SELECT COUNT(*) as count FROM users`;
      totalUsers = parseInt(totalUsersResult[0].count);
    } catch (e) {
      console.log('Users table not found or error:', e);
    }

    try {
      // Get active users today (those with recent activity)
      const activeUsersResult = await sql`
        SELECT COUNT(DISTINCT user_id) as count
        FROM user_profiles
        WHERE last_activity_date >= CURRENT_DATE - INTERVAL '1 day'
      `;
      activeUsers = parseInt(activeUsersResult[0].count) || 0;
    } catch (e) {
      console.log('User profiles table not found or error:', e);
    }

    try {
      // Get total videos count
      const totalVideosResult = await sql`
        SELECT COUNT(*) as count FROM training_videos WHERE is_active = true
      `;
      totalVideos = parseInt(totalVideosResult[0].count);
    } catch (e) {
      console.log('Training videos table not found or error:', e);
    }

    try {
      // Get total quizzes count
      const totalQuizzesResult = await sql`SELECT COUNT(*) as count FROM video_quizzes`;
      totalQuizzes = parseInt(totalQuizzesResult[0].count);
    } catch (e) {
      console.log('Video quizzes table not found or error:', e);
    }

    try {
      // Calculate average comprehension (from quiz scores)
      const avgComprehensionResult = await sql`
        SELECT AVG(quiz_score) as avg_score
        FROM user_video_progress
        WHERE quiz_score IS NOT NULL
      `;
      averageComprehension = Math.round(avgComprehensionResult[0].avg_score || 0);
    } catch (e) {
      console.log('User video progress table not found or error:', e);
    }

    try {
      // Calculate completion rate (users who completed at least one video)
      const completionRateResult = await sql`
        SELECT
          (COUNT(DISTINCT CASE WHEN completed = true THEN user_id END) * 100.0 / NULLIF(COUNT(DISTINCT user_id), 0)) as rate
        FROM user_video_progress
      `;
      completionRate = Math.round(completionRateResult[0].rate || 0);
    } catch (e) {
      console.log('Completion rate calculation error:', e);
    }

    try {
      // Get recent activity
      const recentActivityResult = await sql`
        SELECT
          u.name as user_name,
          'Completed video' as action,
          tv.title as details,
          uvp.completed_at as time
        FROM user_video_progress uvp
        JOIN users u ON uvp.user_id = u.id
        JOIN training_videos tv ON uvp.video_id = tv.id
        WHERE uvp.completed = true
          AND uvp.completed_at >= NOW() - INTERVAL '24 hours'
        ORDER BY uvp.completed_at DESC
        LIMIT 10
      `;

      recentActivity = recentActivityResult.map((activity, index) => ({
        id: index + 1,
        user: activity.user_name,
        action: activity.action,
        details: activity.details,
        time: formatTimeAgo(new Date(activity.time))
      }));
    } catch (e) {
      console.log('Recent activity query error:', e);
      recentActivity = [];
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalVideos,
        totalQuizzes,
        averageComprehension,
        completionRate,
      },
      recentActivity,
      success: true
    });

  } catch (error) {
    console.error('Critical error in dashboard API:', error);
    // Return fallback data instead of error
    return NextResponse.json({
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        totalVideos: 0,
        totalQuizzes: 0,
        averageComprehension: 0,
        completionRate: 0,
      },
      recentActivity: [],
      success: false,
      message: 'Database connection issue - showing default values'
    });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}