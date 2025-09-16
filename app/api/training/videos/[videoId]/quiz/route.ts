import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    // Mock quiz data - replace with database query
    const quiz = {
      id: '1',
      videoId: videoId,
      title: 'Comprehension Check',
      description: 'Test your understanding of the video content',
      passingScore: 70,
      attempts: 3,
      questions: [
        {
          id: 'q1',
          question: 'What is the most important first step when approaching a door?',
          type: 'multiple_choice',
          options: [
            'Knock loudly to ensure they hear you',
            'Take a step back after knocking',
            'Start talking immediately',
            'Check if anyone is home first',
          ],
          correctAnswer: 'B',
          explanation: 'Taking a step back shows respect for personal space and makes homeowners feel safer.',
          points: 1,
        },
        {
          id: 'q2',
          question: 'Building rapport is more important than making the sale on the first visit.',
          type: 'true_false',
          correctAnswer: 'true',
          explanation: 'Trust and rapport are the foundation of successful sales relationships.',
          points: 1,
        },
        {
          id: 'q3',
          question: 'Describe the key elements of building trust with a homeowner.',
          type: 'open_ended',
          expectedKeywords: ['listen', 'empathy', 'genuine', 'respect', 'understand'],
          points: 2,
        },
      ],
    };

    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}