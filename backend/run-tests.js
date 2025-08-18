const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test configuration
const config = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test data
const testData = {
  admin: {
    name: 'System Administrator Test User',
    email: 'admin@test.com',
    password: 'Admin@123',
    address: '123 Admin Street, Admin City, AC 12345'
  },
  normal: {
    name: 'Normal User Test Account',
    email: 'user@test.com',
    password: 'User@123',
    address: '456 User Avenue, User Town, UT 67890'
  },
  storeOwner: {
    name: 'Store Owner Test Business',
    email: 'store@test.com',
    password: 'Store@123',
    address: '789 Store Road, Store City, SC 11111'
  },
  store: {
    name: 'Test Store',
    email: 'teststore@test.com',
    address: '321 Store Street, Store Town, ST 22222'
  }
};

let tokens = {};
let ids = {};

// Test utilities
const test = async (name, testFn) => {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    await testFn();
    console.log(`✅ ${name} - PASSED`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
};

// API Tests
const tests = {
  // Test 1: User Registration
  async testUserRegistration() {
    const response = await axios.post(`${BASE_URL}/signup`, testData.normal, config);
    if (response.data.id) {
      ids.normal = response.data.id;
    }
  },

  // Test 2: User Login
  async testUserLogin() {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: testData.normal.email,
      password: testData.normal.password
    }, config);
    tokens.normal = response.data.token;
  },

  // Test 3: Admin Login (if admin exists)
  async testAdminLogin() {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: testData.admin.email,
        password: testData.admin.password
      }, config);
      tokens.admin = response.data.token;
    } catch (error) {
      console.log('   ⚠️ Admin login failed (admin may not exist)');
    }
  },

  // Test 4: Admin Dashboard
  async testAdminDashboard() {
    if (!tokens.admin) throw new Error('Admin token not available');
    
    const response = await axios.get(`${BASE_URL}/admin/dashboard`, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.admin}` }
    });
    
    if (!response.data.totalUsers && !response.data.totalStores && !response.data.totalRatings) {
      throw new Error('Dashboard data incomplete');
    }
  },

  // Test 5: Admin Add Store Owner
  async testAdminAddStoreOwner() {
    if (!tokens.admin) throw new Error('Admin token not available');
    
    const response = await axios.post(`${BASE_URL}/admin/users`, {
      ...testData.storeOwner,
      role: 'store_owner'
    }, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.admin}` }
    });
    
    ids.storeOwner = response.data.id;
  },

  // Test 6: Store Owner Login
  async testStoreOwnerLogin() {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: testData.storeOwner.email,
      password: testData.storeOwner.password
    }, config);
    tokens.storeOwner = response.data.token;
  },

  // Test 7: Admin Add Store
  async testAdminAddStore() {
    if (!tokens.admin || !ids.storeOwner) throw new Error('Admin token or store owner ID not available');
    
    const response = await axios.post(`${BASE_URL}/admin/stores`, {
      ...testData.store,
      owner_id: ids.storeOwner
    }, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.admin}` }
    });
    
    ids.store = response.data.id;
  },

  // Test 8: Customer View Stores
  async testCustomerViewStores() {
    if (!tokens.normal) throw new Error('Normal user token not available');
    
    const response = await axios.get(`${BASE_URL}/customer/stores`, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.normal}` }
    });
    
    if (!Array.isArray(response.data)) {
      throw new Error('Stores response is not an array');
    }
  },

  // Test 9: Customer Submit Rating
  async testCustomerSubmitRating() {
    if (!tokens.normal || !ids.store) throw new Error('Normal user token or store ID not available');
    
    const response = await axios.post(`${BASE_URL}/customer/ratings`, {
      store_id: ids.store,
      rating: 4,
      comment: 'Great store!'
    }, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.normal}` }
    });
    
    if (!response.data.message) {
      throw new Error('Rating submission failed');
    }
  },

  // Test 10: Store Owner View Ratings
  async testStoreOwnerViewRatings() {
    if (!tokens.storeOwner) throw new Error('Store owner token not available');
    
    const response = await axios.get(`${BASE_URL}/storeowner/ratings`, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.storeOwner}` }
    });
    
    if (!response.data.ratings || !Array.isArray(response.data.ratings)) {
      throw new Error('Ratings response format incorrect');
    }
  },

  // Test 11: Admin List Users
  async testAdminListUsers() {
    if (!tokens.admin) throw new Error('Admin token not available');
    
    const response = await axios.get(`${BASE_URL}/admin/users?role=normal`, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.admin}` }
    });
    
    if (!Array.isArray(response.data)) {
      throw new Error('Users response is not an array');
    }
  },

  // Test 12: Admin List Stores
  async testAdminListStores() {
    if (!tokens.admin) throw new Error('Admin token not available');
    
    const response = await axios.get(`${BASE_URL}/admin/stores`, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.admin}` }
    });
    
    if (!Array.isArray(response.data)) {
      throw new Error('Stores response is not an array');
    }
  },

  // Test 13: Password Update
  async testPasswordUpdate() {
    if (!tokens.normal) throw new Error('Normal user token not available');
    
    const response = await axios.patch(`${BASE_URL}/customer/password`, {
      newPassword: 'NewPass@123'
    }, {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${tokens.normal}` }
    });
    
    if (!response.data.message) {
      throw new Error('Password update failed');
    }
  },

  // Test 14: Form Validations
  async testFormValidations() {
    // Test invalid name (too short)
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: 'Short',
        email: 'short@test.com',
        password: 'Short@123',
        address: 'Short Address'
      }, config);
      throw new Error('Name validation should have failed');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error('Name validation not working');
      }
    }

    // Test invalid password
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: 'Valid Name That Is Long Enough',
        email: 'valid@test.com',
        password: 'weak',
        address: 'Valid Address'
      }, config);
      throw new Error('Password validation should have failed');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error('Password validation not working');
      }
    }
  },

  // Test 15: Logout
  async testLogout() {
    const response = await axios.post(`${BASE_URL}/logout`, {}, config);
    
    if (!response.data.message) {
      throw new Error('Logout failed');
    }
  }
};

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Backend API Tests...\n');
  
  const results = [];
  
  for (const [testName, testFn] of Object.entries(tests)) {
    const passed = await test(testName, testFn);
    results.push({ name: testName, passed });
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your backend is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
  }
  
  return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, tests };
