import { NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack-server';

export async function GET() {
  try {
    // Fetch all users from Stack Auth
    const users = await stackServerApp.listUsers();

    console.log('Fetched Stack users count:', users.length);
    if (users.length > 0) {
      console.log('First user example:', JSON.stringify(users[0], null, 2));
    }

    // Map the users to match what the frontend expects
    const mappedUsers = users.map(user => ({
      id: user.id,
      primaryEmail: user.primaryEmail || 'No email',
      displayName: user.displayName || 'No name',
      signedUpAt: user.signedUpAt,
      lastActiveAt: user.lastActiveAt,
      hasPassword: user.hasPassword,
      // Match the expected serverMetadata structure
      serverMetadata: {
        role: user.serverMetadata?.role || user.clientMetadata?.role || 'user'
      }
    }));

    return NextResponse.json({ users: mappedUsers });
  } catch (error) {
    console.error('Error fetching Stack users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}