const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testRoleSignup() {
  console.log('�� Testing Role-Based Signup System...\n');

  try {
    // Test 1: Customer Signup
    console.log('1️⃣ Testing Customer Signup...');
    const customerData = {
      name: 'John Doe Customer Test User',
      email: 'customer@test.com',
      address: '123 Customer Street, Customer City, CC 12345',
      password: 'Customer@123',
      role: 'normal'
    };

    const customerResponse = await axios.post(`${BASE_URL}/signup`, customerData);
    console.log('✅ Customer created:', customerResponse.data);

    // Test 2: Store Owner Signup
    console.log('\n2️⃣ Testing Store Owner Signup...');
    const storeOwnerData = {
      name: 'Jane Smith Store Owner Test',
      email: 'storeowner@test.com',
      address: '456 Store Street, Store City, SC 67890',
      password: 'Store@123',
      role: 'store_owner'
    };

    const storeOwnerResponse = await axios.post(`${BASE_URL}/signup`, storeOwnerData);
    console.log('✅ Store Owner created:', storeOwnerResponse.data);

    // Test 3: Test Login for Customer
    console.log('\n3️⃣ Testing Customer Login...');
    const customerLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'customer@test.com',
      password: 'Customer@123'
    });
    console.log('✅ Customer login successful:', customerLogin.data);

    // Test 4: Test Login for Store Owner
    console.log('\n4️⃣ Testing Store Owner Login...');
    const storeOwnerLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'storeowner@test.com',
      password: 'Store@123'
    });
    console.log('✅ Store Owner login successful:', storeOwnerLogin.data);

    // Test 5: Test Admin Login
    console.log('\n5️⃣ Testing Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@test.com',
      password: 'Admin@123'
    });
    console.log('✅ Admin login successful:', adminLogin.data);

    console.log('\n🎉 All tests passed! Role-based authentication is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testRoleSignup();



