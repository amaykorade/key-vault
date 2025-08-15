import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const workingToken = 'tok_rctyg4wv1nq_577g0l6oup'; // Working token

async function testEnvironmentFiltering() {
  console.log('🔍 Testing fixed environment filtering logic...\n');

  try {
    // Test 1: Test with development environment (should work now)
    console.log('1️⃣ Testing with environment=development...');
    const devResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=development`, {
      headers: {
        'Authorization': `Bearer ${workingToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${devResponse.status}`);
    
    if (devResponse.ok) {
      const keyData = await devResponse.json();
      console.log('✅ Development environment filtering successful!');
      console.log(`   Key Name: ${keyData.key.name}`);
      console.log(`   Environment: ${keyData.key.environment}`);
      console.log(`   Value: ${keyData.key.value ? '***HIDDEN***' : 'No value'}`);
    } else {
      const error = await devResponse.text();
      console.log('❌ Development environment filtering failed');
      console.log('   Error:', error);
    }

    // Test 2: Test with production environment (should not find the key)
    console.log('\n2️⃣ Testing with environment=production...');
    const prodResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=production`, {
      headers: {
        'Authorization': `Bearer ${workingToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${prodResponse.status}`);
    
    if (prodResponse.ok) {
      const keyData = await devResponse.json();
      console.log('⚠️ Found key in production (unexpected):', keyData.key?.name);
    } else {
      const error = await prodResponse.text();
      console.log('✅ Correctly no key found in production environment');
      console.log('   Response:', error);
    }

    // Test 3: Test with invalid environment (should return 400)
    console.log('\n3️⃣ Testing with invalid environment...');
    const invalidResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=invalid_env`, {
      headers: {
        'Authorization': `Bearer ${workingToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${invalidResponse.status}`);
    
    if (invalidResponse.status === 400) {
      const error = await invalidResponse.text();
      console.log('✅ Invalid environment correctly rejected with 400');
      console.log('   Response:', error);
    } else {
      const response = await invalidResponse.text();
      console.log('⚠️ Invalid environment not properly rejected');
      console.log('   Response:', response);
    }

    // Test 4: Test without environment parameter (should work as before)
    console.log('\n4️⃣ Testing without environment parameter...');
    const noEnvResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL`, {
      headers: {
        'Authorization': `Bearer ${workingToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${noEnvResponse.status}`);
    
    if (noEnvResponse.ok) {
      const keyData = await noEnvResponse.json();
      console.log('✅ No environment parameter still works');
      console.log(`   Key Name: ${keyData.key.name}`);
      console.log(`   Environment: ${keyData.key.environment}`);
    } else {
      const error = await noEnvResponse.text();
      console.log('❌ No environment parameter failed');
      console.log('   Error:', error);
    }

    // Test 5: Test with different case (should be normalized)
    console.log('\n5️⃣ Testing with different case (DEVELOPMENT)...');
    const caseResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=DEVELOPMENT`, {
      headers: {
        'Authorization': `Bearer ${workingToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${caseResponse.status}`);
    
    if (caseResponse.ok) {
      const keyData = await caseResponse.json();
      console.log('✅ Case normalization working (DEVELOPMENT -> development)');
      console.log(`   Key Name: ${keyData.key.name}`);
      console.log(`   Environment: ${keyData.key.environment}`);
    } else {
      const error = await caseResponse.text();
      console.log('❌ Case normalization failed');
      console.log('   Error:', error);
    }

    console.log('\n🎯 Environment filtering test complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testEnvironmentFiltering(); 