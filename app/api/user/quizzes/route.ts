import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    // Fetch all active quizzes
    // For now, we show all quizzes since we're not tracking completion yet
    const quizzes = await sql`
      SELECT
        q.id,
        q.video_id as "videoId",
        q.questions,
        q.passing_score as "passingScore",
        q.created_at as "createdAt",
        v.title as "videoTitle"
      FROM video_quizzes q
      LEFT JOIN training_videos v ON q.video_id = v.id
      ORDER BY q.created_at DESC
    `;

    // Parse the JSONB questions and extract metadata
    const formattedQuizzes = quizzes.map(quiz => {
      const allQuestions = quiz.questions || [];
      const metadata = allQuestions.find((q: any) => q._metadata) || allQuestions[0] || {};
      const actualQuestions = allQuestions.filter((q: any) => !q._metadata);

      return {
        id: quiz.id,
        videoId: quiz.videoId,
        videoTitle: quiz.videoTitle || 'Standalone Quiz',
        title: metadata.title || `Quiz ${quiz.id.slice(0, 8)}`,
        description: metadata.description || '',
        category: metadata.category || 'general',
        difficulty: metadata.difficulty || 'medium',
        passingScore: quiz.passingScore,
        questionCount: actualQuestions.length,
        timeLimit: metadata.timeLimit,
        createdAt: quiz.createdAt,
        // Placeholder for completion status - will be implemented later
        isCompleted: false,
        lastScore: null
      };
    });

    return NextResponse.json({ quizzes: formattedQuizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}