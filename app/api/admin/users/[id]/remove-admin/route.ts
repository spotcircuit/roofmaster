import { NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack-server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await stackServerApp.getUser();

    // Check if current user is admin
    if (!currentUser || currentUser.serverMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params to avoid Next.js warning
    const { id: userId } = await params;

    // CRITICAL: Don't allow removing admin from yourself
    if (userId === currentUser.id) {
      console.log('Blocked attempt to remove own admin status');
      return NextResponse.json(
        { error: 'Cannot remove admin from yourself' },
        { status: 400 }
      );
    }

    // CRITICAL: Don't allow removing Brian's admin status
    if (userId === '150b5d01-9680-491c-8f45-8dde6284589a') {
      console.log('Blocked attempt to remove Brian admin status');
      return NextResponse.json(
        { error: 'Cannot remove primary admin' },
        { status: 400 }
      );
    }

    // List all users and find the one to update
    const users = await stackServerApp.listUsers();
    const userToUpdate = users.find(u => u.id === userId);

    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user to update is Brian (double check by email)
    if (userToUpdate.primaryEmail === 'brian@spotcircuit.com') {
      console.log('Blocked attempt to remove Brian admin status (by email)');
      return NextResponse.json(
        { error: 'Cannot remove primary admin' },
        { status: 400 }
      );
    }

    // Update the user's server metadata to remove admin role
    if (userToUpdate.update) {
      await userToUpdate.update({
        serverMetadata: {
          role: 'user'
        }
      });
      console.log('Admin role removed from user:', userId);
    } else {
      return NextResponse.json(
        { error: 'Stack Auth SDK limitation - cannot update user' },
        { status: 501 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing admin:', error);
    return NextResponse.json(
      { error: 'Failed to remove admin', details: error.message },
      { status: 500 }
    );
  }
}
