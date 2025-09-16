require('dotenv').config({ path: '.env.local' });

async function checkUser() {
  const email = 'brian@spotcircuit.com';

  console.log('📋 Checking user details...\n');

  try {
    // Get all users to find the correct one
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

    const data = await listResponse.json();
    console.log('Total users:', data.items?.length || 0);

    const user = data.items?.find(u => u.primary_email === email);

    if (!user) {
      console.error(`User with email ${email} not found`);
      console.log('\nAvailable users:');
      data.items?.forEach(u => {
        console.log(`  - ${u.primary_email} (ID: ${u.id})`);
      });
      return;
    }

    console.log('\n✅ Found user:', email);
    console.log('ID:', user.id);
    console.log('\nFull user object:');
    console.log(JSON.stringify(user, null, 2));

    console.log('\n🔍 Checking metadata fields:');
    console.log('server_metadata:', user.server_metadata);
    console.log('serverMetadata:', user.serverMetadata);
    console.log('metadata:', user.metadata);
    console.log('client_metadata:', user.client_metadata);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUser();