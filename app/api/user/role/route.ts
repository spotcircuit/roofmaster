import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack-server';

export async function GET(request: NextRequest) {
  try {
    // Get the current user from Stack Auth using the proper method
    const user = await stackServerApp.getUser();

    if (!user) {
      console.log('No user found');
      return NextResponse.json({ role: 'user' });
    }

    // The serverMetadata is available on the user object
    console.log('User found:', user.primaryEmail);
    console.log('Server metadata:', user.serverMetadata);

    const role = user.serverMetadata?.role || 'user';
    console.log('User role:', role);

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error checking user role:', error);
    return NextResponse.json({ role: 'user' });
  }
}