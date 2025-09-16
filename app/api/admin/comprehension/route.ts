import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'all';

    // Mock data - replace with database query
    const users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        overallScore: 85,
        videosCompleted: 8,
        quizzesPassed: 7,
        quizzesFailed: 1,
        averageQuizScore: 82,
        strongAreas: ['Door Knocking', 'Rapport Building'],
        weakAreas: ['Objection Handling'],
        lastAssessment: new Date().toISOString(),
        recentActivity: [
          {
            videoTitle: 'Introduction to Door Knocking',
            quizScore: 90,
            comprehensionScore: 88,
            date: new Date().toISOString(),
          },
        ],
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        overallScore: 72,
        videosCompleted: 5,
        quizzesPassed: 4,
        quizzesFailed: 1,
        averageQuizScore: 75,
        strongAreas: ['Closing Techniques'],
        weakAreas: ['Cold Calling', 'Rapport Building'],
        lastAssessment: new Date().toISOString(),
        recentActivity: [],
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        overallScore: 58,
        videosCompleted: 3,
        quizzesPassed: 1,
        quizzesFailed: 2,
        averageQuizScore: 55,
        strongAreas: [],
        weakAreas: ['Door Knocking', 'Closing', 'Objections'],
        lastAssessment: new Date().toISOString(),
        recentActivity: [],
      },
    ];

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comprehension data' },
      { status: 500 }
    );
  }
}