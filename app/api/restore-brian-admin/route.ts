import { NextResponse } from 'next/server';
import { stackServerApp } from '@/lib/stack-server';

// EMERGENCY ENDPOINT TO RESTORE BRIAN'S ADMIN STATUS
// This endpoint doesn't require auth since Brian lost admin access
export async function GET(request: Request) {
  try {
    console.log('Emergency admin restore initiated...');

    // List all users to find Brian
    const users = await stackServerApp.listUsers();
    const brian = users.find(u =>
      u.primaryEmail === 'brian@spotcircuit.com' ||
      u.id === '150b5d01-9680-491c-8f45-8dde6284589a'
    );

    if (!brian) {
      return NextResponse.json({ error: 'Brian user not found' }, { status: 404 });
    }

    console.log('Found Brian:', {
      id: brian.id,
      email: brian.primaryEmail,
      currentRole: brian.serverMetadata?.role
    });

    // Check if update method exists
    if (brian.update) {
      await brian.update({
        serverMetadata: {
          role: 'admin'
        }
      });

      console.log('Admin status restored for Brian!');
      return NextResponse.json({
        success: true,
        message: 'Admin status restored for brian@spotcircuit.com'
      });
    } else {
      // Update method doesn't exist - this means Stack Auth doesn't support it
      console.log('Cannot update through SDK - Stack Auth limitation');
      return NextResponse.json({
        error: 'Stack Auth SDK does not support updating user metadata. You need to manually update in Stack Auth dashboard.',
        currentRole: brian.serverMetadata?.role
      }, { status: 501 });
    }

  } catch (error) {
    console.error('Error restoring admin:', error);
    return NextResponse.json({ error: 'Failed to restore admin', details: error.message }, { status: 500 });
  }
}