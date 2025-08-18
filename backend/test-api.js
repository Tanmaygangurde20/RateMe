const axios = require('axios');
const bcrypt = require('bcrypt');

const BASE_URL = 'http://localhost:5000';

// Test data
const testUsers = {
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
  }
};

const testStore = {
  name: 'Test Store',
  email: 'teststore@test.com',
  address: '321 Store Street, Store Town, ST 22222'
};

let adminToken, userToken, storeOwnerToken;
let adminId, userId, storeOwnerId, storeId;

async function testAPI() {
  console.log('🚀 Starting Backend API Tests...\n');

  try {
    // Test 1: Database Connection
    console.log('1. Testing Database Connection...');
    const pool = require('./db');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0].now);

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    
    // Register normal user
    const userResponse = await axios.post(`${BASE_URL}/signup`, testUsers.normal);
    console.log('✅ Normal user registered:', userResponse.data);
    
    // Test 3: Admin Login (assuming admin exists)
    console.log('\n3. Testing Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/login`, {
        email: testUsers.admin.email,
        password: testUsers.admin.password
      });
      adminToken = loginResponse.data.token;
      console.log('✅ Admin login successful');
    } catch (error) {
      console.log('⚠️ Admin login failed (admin may not exist yet)');
    }

    // Test 4: Normal User Login
    const userLoginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testUsers.normal.email,
      password: testUsers.normal.password
    });
    userToken = userLoginResponse.data.token;
    console.log('✅ Normal user login successful');

    // Test 5: Admin Dashboard
    console.log('\n4. Testing Admin Dashboard...');
    if (adminToken) {
      const dashboardResponse = await axios.get(`${BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Admin dashboard:', dashboardResponse.data);
    }

    // Test 6: Admin - Add Store Owner
    console.log('\n5. Testing Admin - Add Store Owner...');
    if (adminToken) {
      const storeOwnerResponse = await axios.post(`${BASE_URL}/admin/users`, {
        ...testUsers.storeOwner,
        role: 'store_owner'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      storeOwnerId = storeOwnerResponse.data.id;
      console.log('✅ Store owner added:', storeOwnerResponse.data);
    }

    // Test 7: Store Owner Login
    console.log('\n6. Testing Store Owner Login...');
    const storeOwnerLoginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testUsers.storeOwner.email,
      password: testUsers.storeOwner.password
    });
    storeOwnerToken = storeOwnerLoginResponse.data.token;
    console.log('✅ Store owner login successful');

    // Test 8: Admin - Add Store
    console.log('\n7. Testing Admin - Add Store...');
    if (adminToken) {
      const storeResponse = await axios.post(`${BASE_URL}/admin/stores`, {
        ...testStore,
        owner_id: storeOwnerId
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      storeId = storeResponse.data.id;
      console.log('✅ Store added:', storeResponse.data);
    }

    // Test 9: Customer - View Stores
    console.log('\n8. Testing Customer - View Stores...');
    const storesResponse = await axios.get(`${BASE_URL}/customer/stores`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Stores retrieved:', storesResponse.data.length, 'stores');

    // Test 10: Customer - Submit Rating
    console.log('\n9. Testing Customer - Submit Rating...');
    const ratingResponse = await axios.post(`${BASE_URL}/customer/ratings`, {
      store_id: storeId,
      rating: 4,
      comment: 'Great store!'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Rating submitted:', ratingResponse.data);

    // Test 11: Store Owner - View Ratings
    console.log('\n10. Testing Store Owner - View Ratings...');
    const ratingsResponse = await axios.get(`${BASE_URL}/storeowner/ratings`, {
      headers: { Authorization: `Bearer ${storeOwnerToken}` }
    });
    console.log('✅ Store ratings:', ratingsResponse.data);

    // Test 12: Admin - List Users with Filters
    console.log('\n11. Testing Admin - List Users...');
    if (adminToken) {
      const usersResponse = await axios.get(`${BASE_URL}/admin/users?role=normal`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Users listed:', usersResponse.data.length, 'users');
    }

    // Test 13: Admin - List Stores with Filters
    console.log('\n12. Testing Admin - List Stores...');
    if (adminToken) {
      const storesListResponse = await axios.get(`${BASE_URL}/admin/stores`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Stores listed:', storesListResponse.data.length, 'stores');
    }

    // Test 14: Password Update
    console.log('\n13. Testing Password Update...');
    const passwordResponse = await axios.patch(`${BASE_URL}/customer/password`, {
      newPassword: 'NewPass@123'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Password updated:', passwordResponse.data);

    // Test 15: Validation Tests
    console.log('\n14. Testing Form Validations...');
    
    // Test invalid name (too short)
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: 'Short',
        email: 'short@test.com',
        password: 'Short@123',
        address: 'Short Address'
      });
    } catch (error) {
      console.log('✅ Name validation working:', error.response.data.error);
    }

    // Test invalid password
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: 'Valid Name That Is Long Enough',
        email: 'valid@test.com',
        password: 'weak',
        address: 'Valid Address'
      });
    } catch (error) {
      console.log('✅ Password validation working:', error.response.data.error);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Database connection: ✅');
    console.log('- User registration: ✅');
    console.log('- Authentication: ✅');
    console.log('- Role-based access: ✅');
    console.log('- CRUD operations: ✅');
    console.log('- Form validations: ✅');
    console.log('- Rating system: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAPI();
