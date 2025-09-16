require('dotenv').config({ path: '.env.local' });

async function setAdminRole() {
  const email = 'brian@spotcircuit.com';

  console.log('🔑 Looking up user and setting admin role...');

  try {
    // First, get all users to find the correct ID
    const listResponse = await fetch(`https://api.stack-auth.com/api/v1/users`, {
      method: 'GET',
      headers: {
        'x-stack-project-id': process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
        'x-stack-secret-server-key': process.env.STACK_SECRET_SERVER_KEY,
        'x-stack-access-type': 'server'
      }
    });

    if (!listResponse.ok) {
      const error = await listResponse.text();
      console.error('Failed to list users:', error);
      return;
    }

    const users = await listResponse.json();
    const user = users.items?.find(u => u.primary_email === email);

    if (!user) {
      console.error(`User with email ${email} not found`);
      console.log('Available users:', users.items?.map(u => u.primary_email));
      return;
    }

    const userId = user.id;
    console.log(`Found user: ${email} with ID: ${userId}`);

    // Now set the admin role
    const response = await fetch(`https://api.stack-auth.com/api/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-stack-project-id': process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
        'x-stack-secret-server-key': process.env.STACK_SECRET_SERVER_KEY,
        'x-stack-access-type': 'server'
      },
      body: JSON.stringify({
        server_metadata: {
          role: 'admin'
        }
      })
    });

    if (response.ok) {
      console.log('✅ Admin role set successfully!');
      console.log('You are now an admin in the RoofMaster 24-7 platform.');
      console.log('Refresh your browser to see the Admin Panel button.');
    } else {
      const error = await response.text();
      console.error('❌ Failed to set admin role:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setAdminRole();