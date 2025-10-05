// Test CORS configuration
import fetch from 'node-fetch';

const testCORS = async () => {
  const testOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ];

  console.log('🧪 Testing CORS configuration...\n');

  for (const origin of testOrigins) {
    try {
      console.log(`Testing origin: ${origin}`);
      
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });

      console.log(`  Status: ${response.status}`);
      console.log(`  CORS Headers:`);
      console.log(`    Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
      console.log(`    Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
      console.log(`    Access-Control-Allow-Headers: ${response.headers.get('access-control-allow-headers')}`);
      console.log(`    Access-Control-Allow-Credentials: ${response.headers.get('access-control-allow-credentials')}`);
      console.log('  ✅ CORS test passed\n');
      
    } catch (error) {
      console.log(`  ❌ CORS test failed: ${error.message}\n`);
    }
  }
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCORS();
}

export { testCORS };
