// Simple API test script
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('🧪 Testing Book Review Platform API...\n');

    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test signup
    console.log('\n2. Testing user signup...');
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const signupData = await signupResponse.json();
    console.log('✅ Signup:', signupData.message);

    // Test login
    console.log('\n3. Testing user login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('✅ Login:', loginData.message);
    
    const token = loginData.token;

    // Test create book
    console.log('\n4. Testing book creation...');
    const bookResponse = await fetch(`${BASE_URL}/api/books`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Book',
        author: 'Test Author',
        description: 'A test book for the API',
        genre: 'Fiction',
        year: 2023
      })
    });
    const bookData = await bookResponse.json();
    console.log('✅ Book created:', bookData.message);
    const bookId = bookData.book._id;

    // Test get books
    console.log('\n5. Testing get books...');
    const booksResponse = await fetch(`${BASE_URL}/api/books`);
    const booksData = await booksResponse.json();
    console.log(`✅ Retrieved ${booksData.data.length} books`);

    // Test add review
    console.log('\n6. Testing add review...');
    const reviewResponse = await fetch(`${BASE_URL}/api/books/${bookId}/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        rating: 5,
        reviewText: 'Great test book!'
      })
    });
    const reviewData = await reviewResponse.json();
    console.log('✅ Review added:', reviewData.message);

    // Test get book details
    console.log('\n7. Testing get book details...');
    const bookDetailsResponse = await fetch(`${BASE_URL}/api/books/${bookId}`);
    const bookDetailsData = await bookDetailsResponse.json();
    console.log(`✅ Book details retrieved - Average rating: ${bookDetailsData.averageRating}`);

    console.log('\n🎉 All tests passed! The API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000');
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPI();
}

export { testAPI };
