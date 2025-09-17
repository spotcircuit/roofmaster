import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT
        q.id,
        q.video_id as "videoId",
        q.questions,
        q.passing_score as "passingScore",
        q.created_at as "createdAt",
        q.updated_at as "updatedAt",
        v.title as "videoTitle"
      FROM video_quizzes q
      LEFT JOIN training_videos v ON q.video_id = v.id
      WHERE q.id = ${quizId}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Parse and format the quiz data
    const quiz = result[0];
    const allQuestions = quiz.questions || [];
    const metadata = allQuestions.find((q: any) => q._metadata) || allQuestions[0] || {};
    const actualQuestions = allQuestions.filter((q: any) => !q._metadata);

    const formattedQuiz = {
      id: quiz.id,
      videoId: quiz.videoId,
      videoTitle: quiz.videoTitle,
      title: metadata.title || `Quiz ${quiz.id.slice(0, 8)}`,
      description: metadata.description || '',
      category: metadata.category || 'general',
      difficulty: metadata.difficulty || 'medium',
      passingScore: quiz.passingScore,
      timeLimit: metadata.timeLimit,
      questions: actualQuestions, // Return only actual questions
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    };

    return NextResponse.json({ quiz: formattedQuiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}