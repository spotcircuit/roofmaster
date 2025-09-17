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
    console.log('Making user admin:', userId);

    // List all users and find the one to update
    const users = await stackServerApp.listUsers();
    const userToUpdate = users.find(u => u.id === userId);

    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Current user role:', userToUpdate.serverMetadata?.role);

    // Check if already admin
    if (userToUpdate.serverMetadata?.role === 'admin') {
      console.log('User is already an admin');
      return NextResponse.json({
        success: true,
        message: 'User is already an admin'
      });
    }

    // Update the user using the update method (we know this works!)
    if (userToUpdate.update) {
      await userToUpdate.update({
        serverMetadata: {
          role: 'admin'
        }
      });
      console.log('User updated successfully - now admin');
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Stack Auth SDK limitation - cannot update user' },
        { status: 501 }
      );
    }

  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { error: 'Failed to make user admin', details: error.message },
      { status: 500 }
    );
  }
}
