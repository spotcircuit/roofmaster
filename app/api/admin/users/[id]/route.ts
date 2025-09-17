import { NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack-server';

export async function DELETE(
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

    // Don't allow deleting yourself
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Stack Auth doesn't provide a delete method through the SDK
    // We need to find the user and try to delete them
    const users = await stackServerApp.listUsers();
    const userToDelete = users.find(u => u.id === userId);

    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user object has a delete method
    if (userToDelete.delete) {
      await userToDelete.delete();
    } else {
      // If no delete method exists, return an error explaining the limitation
      return NextResponse.json(
        { error: 'Stack Auth SDK does not support deleting users. Please delete the user directly in the Stack Auth dashboard.' },
        { status: 501 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}