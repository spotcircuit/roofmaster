import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();

    // Update user's server metadata with role using Stack Auth API
    const response = await fetch(`https://api.stack-auth.com/api/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-stack-project-id': process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
        'x-stack-secret-server-key': process.env.STACK_SECRET_SERVER_KEY!,
      },
      body: JSON.stringify({
        serverMetadata: {
          role: role // 'admin' or 'user'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting user role:', error);
    return NextResponse.json({ error: 'Failed to set role' }, { status: 500 });
  }
}