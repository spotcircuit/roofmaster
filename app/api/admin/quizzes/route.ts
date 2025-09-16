import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    // Fetch all quizzes with optional video information
    const quizzes = await sql`
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
      ORDER BY q.created_at DESC
    `;

    // Parse the JSONB questions and extract metadata
    const formattedQuizzes = quizzes.map(quiz => {
      const questions = quiz.questions || [];
      const firstQuestion = questions[0] || {};

      return {
        id: quiz.id,
        videoId: quiz.videoId,
        videoTitle: quiz.videoTitle || 'Standalone Quiz',
        title: firstQuestion.title || `Quiz ${quiz.id.slice(0, 8)}`,
        description: firstQuestion.description || '',
        category: firstQuestion.category || 'general',
        difficulty: firstQuestion.difficulty || 'medium',
        passingScore: quiz.passingScore,
        questionCount: questions.length,
        questions: questions,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, difficulty, passingScore, timeLimit, videoId, questions } = body;

    // Store metadata in the first question object for easy access
    const questionsWithMetadata = [
      {
        title,
        description,
        category,
        difficulty,
        timeLimit,
        _metadata: true
      },
      ...questions
    ];

    const result = await sql`
      INSERT INTO video_quizzes (
        video_id,
        questions,
        passing_score
      ) VALUES (
        ${videoId || null},
        ${JSON.stringify(questionsWithMetadata)},
        ${passingScore || 70}
      )
      RETURNING
        id,
        video_id as "videoId",
        questions,
        passing_score as "passingScore",
        created_at as "createdAt"
    `;

    return NextResponse.json({
      quiz: result[0],
      success: true,
      message: 'Quiz created successfully!'
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, category, difficulty, passingScore, timeLimit, videoId, questions } = body;

    // Store metadata in the first question object
    const questionsWithMetadata = [
      {
        title,
        description,
        category,
        difficulty,
        timeLimit,
        _metadata: true
      },
      ...questions
    ];

    const result = await sql`
      UPDATE video_quizzes
      SET
        video_id = ${videoId || null},
        questions = ${JSON.stringify(questionsWithMetadata)},
        passing_score = ${passingScore || 70},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING
        id,
        video_id as "videoId",
        questions,
        passing_score as "passingScore",
        updated_at as "updatedAt"
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      quiz: result[0],
      success: true,
      message: 'Quiz updated successfully!'
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM video_quizzes
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}