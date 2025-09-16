require('dotenv').config({ path: '.env.local' });

async function deleteUser() {
  const userId = '8f74f544-b1e1-49bf-9b8e-5d4dd67306eb'; // brian@spotcircuit.com

  console.log('🗑️ Deleting user brian@spotcircuit.com...');

  try {
    const response = await fetch(`https://api.stack-auth.com/api/v1/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-stack-project-id': process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
        'x-stack-secret-server-key': process.env.STACK_SECRET_SERVER_KEY,
        'x-stack-access-type': 'server'
      }
    });

    if (response.ok) {
      console.log('✅ User deleted successfully!');
      console.log('You can now sign in with any OAuth provider and it will create a new account.');
    } else {
      const error = await response.text();
      console.error('❌ Failed to delete user:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deleteUser();