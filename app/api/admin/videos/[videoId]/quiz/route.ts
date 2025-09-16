import { NextRequest, NextResponse } from 'next/server';

// Mock quiz storage
const quizzes: Record<string, any> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const quiz = quizzes[videoId] || null;
    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const body = await request.json();

    const quiz = {
      id: Date.now().toString(),
      videoId: videoId,
      ...body,
      createdAt: new Date().toISOString(),
    };

    quizzes[videoId] = quiz;

    // In production, save to database
    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const body = await request.json();

    const quiz = {
      ...quizzes[videoId],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    quizzes[videoId] = quiz;

    // In production, update in database
    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}