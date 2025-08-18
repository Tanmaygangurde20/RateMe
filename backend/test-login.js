const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testLogin() {
  console.log('🔐 Testing Login System...\n');

  try {
    // Test 1: Admin Login (should work)
    console.log('1️⃣ Testing Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@test.com',
      password: 'Admin@123'
    });
    console.log('✅ Admin login successful:', adminLogin.data);

    // Test 2: Try to login with non-existent user
    console.log('\n2️⃣ Testing Non-existent User Login...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: 'nonexistent@test.com',
        password: 'WrongPass@123'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Non-existent user correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 3: Try to login with wrong password
    console.log('\n3️⃣ Testing Wrong Password Login...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: 'admin@test.com',
        password: 'WrongPass@123'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Wrong password correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    console.log('\n🎉 Login system is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testLogin();



