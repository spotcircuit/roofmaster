import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    // Check if database connection works
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({ quizzes: [] });
    }

    const quizzes = await sql`
      SELECT
        vq.id,
        vq.video_id as "videoId",
        vq.questions,
        vq.passing_score as "passingScore",
        vq.created_at as "createdAt",
        vq.updated_at as "updatedAt",
        tv.title as "videoTitle"
      FROM video_quizzes vq
      LEFT JOIN training_videos tv ON vq.video_id = tv.id
      ORDER BY vq.created_at DESC
    `;

    // Format quizzes for the practice page
    const formattedQuizzes = quizzes.map(quiz => {
      const questions = quiz.questions || [];
      const firstQuestion = questions[0] || {};

      return {
        id: quiz.id,
        title: quiz.videoTitle ? `${quiz.videoTitle} Quiz` : firstQuestion.title || 'Practice Quiz',
        description: firstQuestion.description || `Test your knowledge${quiz.videoTitle ? ' of ' + quiz.videoTitle : ''}`,
        category: firstQuestion.category || 'general',
        difficulty: firstQuestion.difficulty || 'medium',
        questionCount: questions.length,
        timeLimit: Math.ceil(questions.length * 2), // 2 minutes per question
        passingScore: quiz.passingScore || 80,
        attempts: 0, // Would come from user progress tracking
        bestScore: undefined // Would come from user progress tracking
      };
    });

    return NextResponse.json({ quizzes: formattedQuizzes });
  } catch (error: any) {
    console.error('Error fetching quizzes:', error);

    // If table doesn't exist, return empty array instead of error
    if (error.message?.includes('relation "video_quizzes" does not exist')) {
      console.log('Video quizzes table does not exist yet');
      return NextResponse.json({ quizzes: [] });
    }

    // For other errors, still return empty array but log the error
    return NextResponse.json({ quizzes: [] });
  }
}