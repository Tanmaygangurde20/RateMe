const API_BASE_URL = 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Authentication API
export const authAPI = {
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Signup failed' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      
      return { message: 'Logged out successfully' };
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      return { message: 'Logged out successfully' };
    }
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to get profile' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/password`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to update password' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  }
};

// Customer API
export const customerAPI = {
  getStores: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/customer/stores?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch stores' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  submitRating: async (ratingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/ratings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ratingData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to submit rating' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  getMyRatings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/my-ratings`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch ratings' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  getStoreDetails: async (storeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/stores/${storeId}`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch store details' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  }
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch dashboard' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  getUsers: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch users' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  getStores: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/admin/stores?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch stores' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  addUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to add user' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  addStore: async (storeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stores`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to add store' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  getUserDetails: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch user details' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  getStoreDetails: async (storeId) => {
    return request(`/admin/stores/${storeId}`);
  },
  updateAdminPassword: async (newPassword) => {
    return request('/admin/password', {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    });
  },
  getAdmins: async () => {
    return request('/admin/admins');
  },
  addAdmin: async (adminData) => {
    return request('/admin/admins', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },
};

// Store Owner API
export const storeOwnerAPI = {
  getDashboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/storeowner/dashboard`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch dashboard' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  },

  getStoreRatings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/storeowner/ratings`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch ratings' };
      }
      
      return data;
    } catch (error) {
      return { error: 'Failed to connect to server' };
    }
  }
};
