import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const workingToken = 'tok_rctyg4wv1nq_577g0l6oup'; // This token was working before

async function testWorkingTokenAgain() {
  console.log('🔑 Testing if working token still works...\n');

  try {
    // Test authentication with the working token
    console.log('1️⃣ Testing authentication with working token...');
    const authResponse = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${workingToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${authResponse.status}`);
    
    if (authResponse.ok) {
      const userData = await authResponse.json();
      console.log('✅ Authentication successful!');
      console.log(`   User: ${userData.user.email}`);
      console.log(`   Role: ${userData.user.role}`);
      console.log(`   Permissions: ${userData.user.permissions?.length || 0} permissions`);
    } else {
      const error = await authResponse.text();
      console.log('❌ Authentication failed');
      console.log('   Error:', error);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testWorkingTokenAgain(); 