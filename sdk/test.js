import KeyVault from './index.js';

// Test configuration
const config = {
  apiUrl: 'http://localhost:3000/api',
  token: null,
  sessionCookie: null
};

// Test credentials (use environment variables in production)
// const testUser = {
//   email: 'test@example.com',
//   password: 'testpassword123'
// };

const testUser = {
    email: 'amaykorade@gmail.com',
    password: 'Amay@2020'
  };

async function login() {
  try {
    const res = await fetch(`${config.apiUrl.replace(/\/api$/, '')}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await res.json();
    if (!data.session?.token) {
      throw new Error('No token received');
    }

    // Get the session cookie from response headers
    const cookies = res.headers.get('set-cookie');
    if (cookies) {
      const sessionCookie = cookies.split(';')[0];
      config.sessionCookie = sessionCookie;
    }

    return data.session.token;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

async function runTests() {
  try {
    console.log('🔑 Starting KeyVault SDK tests...\n');
    
    // First make sure the server is running
    try {
      await fetch(config.apiUrl);
    } catch (error) {
      console.error('❌ Error: Please start the development server first (npm run dev)');
      return;
    }

    // Step 1: Login and get token
    console.log('1. Authenticating...');
    try {
      config.token = await login();
      console.log('✅ Authentication successful');
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      console.log('\nMake sure to:');
      console.log('1. Run the development server (npm run dev)');
      console.log('2. Seed the database (npm run db:seed)');
      return;
    }

    // Initialize SDK with proper headers
    const kv = new KeyVault({
      apiUrl: config.apiUrl,
      getToken: () => config.token,
      onAuthError: async () => {
        console.log('🔄 Token expired, refreshing...');
        config.token = await login();
      }
    });

    // Monkey patch the _fetchWithAuth method to include session cookie
    const originalFetch = kv._fetchWithAuth.bind(kv);
    kv._fetchWithAuth = async (url, options = {}, retry = true) => {
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          Cookie: config.sessionCookie
        }
      };
      return originalFetch(url, newOptions, retry);
    };

    // Step 2: List keys
    console.log('\n2. Listing keys...');
    try {
      const { keys, total } = await kv.listKeys({
        folderId: 'cmd73hr5z0005ohqjb0dq6vsx',
        limit: 10
      });
      console.log(`✅ Found ${total} keys`);
      
      if (keys.length > 0) {
        console.log('\nFirst few keys:');
        keys.slice(0, 3).forEach(key => {
          console.log(`- ${key.name} (${key.id})`);
        });

        // Step 3: Get specific key details
        console.log('\n3. Fetching specific key details...');
        const keyId = keys[0].id;
        
        // First without value
        const keyWithoutValue = await kv.getKey(keyId);
        console.log('\n✅ Key details (without value):', {
          id: keyWithoutValue.id,
          name: keyWithoutValue.name,
          type: keyWithoutValue.type
        });

        // Then with value
        const keyWithValue = await kv.getKey(keyId, { includeValue: true });
        console.log('\n✅ Key details (with value):', {
          id: keyWithValue.id,
          name: keyWithValue.name,
          type: keyWithValue.type,
          hasValue: Boolean(keyWithValue.value),
          value: keyWithValue.value ? '********' : undefined
        });
      } else {
        console.log('⚠️ No keys found. Please run db:seed first.');
      }
    } catch (error) {
      console.error('❌ Error listing/fetching keys:', error.message);
      console.log('\nTip: Make sure you have run npm run db:seed to create test data');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
runTests().catch(console.error); 