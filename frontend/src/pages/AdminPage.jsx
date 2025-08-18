import React, { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../api.jsx';

const AdminPage = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [admins, setAdmins] = useState([]); // New state for admins
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false); // New state for AddAdminModal
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [userSort, setUserSort] = useState('name asc');
  const [storeSort, setStoreSort] = useState('name asc');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboard();
    } else if (activeTab === 'users') {
      loadUsers(userFilters, userSort);
    } else if (activeTab === 'stores') {
      loadStores(storeFilters, storeSort);
    } else if (activeTab === 'admins') {
      loadAdmins();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getDashboard();
      console.log('Dashboard response:', data);
      if (data.error) {
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (filters = {}, sort = 'name asc') => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getUsers({ ...filters, sort });
      console.log('Users response:', data);
      if (data.error) {
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setUsers(data);
      }
    } catch (err) {
      console.error('Users error:', err);
      setError('Failed to load users');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadStores = async (filters = {}, sort = 'name asc') => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getStores({ ...filters, sort });
      console.log('Stores response:', data);
      if (data.error) {
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setStores(data);
      }
    } catch (err) {
      console.error('Stores error:', err);
      setError('Failed to load stores');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getAdmins();
      if (data.error) {
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setAdmins(data);
      }
    } catch (err) {
      console.error('Admins error:', err);
      setError('Failed to load admins');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    setLoading(true);
    setError('');
    try {
      // Validate userData
      if (!/^[a-zA-Z\s]{20,60}$/.test(userData.name)) {
        throw new Error('Name must be 20-60 characters, letters and spaces only');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Invalid email format');
      }
      if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(userData.password)) {
        throw new Error('Password must be 8-16 characters with at least one uppercase and one special character');
      }
      if (userData.address.length > 400) {
        throw new Error('Address must not exceed 400 characters');
      }
      const data = await adminAPI.addUser(userData);
      console.log('Add user response:', data);
      if (data.error) {
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setSuccess('User added successfully!');
        setShowAddUser(false);
        loadUsers(userFilters, userSort);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Add user error:', err);
      setError(err.message || 'Failed to add user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async (storeData) => {
    setLoading(true);
    setError('');
    try {
      // Validate storeData
      if (!storeData.name || storeData.name.length > 100) {
        throw new Error('Store name must be 1-100 characters');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeData.email)) {
        throw new Error('Invalid store email format');
      }
      if (!storeData.address || storeData.address.length > 400) {
        throw new Error('Store address must be 1-400 characters');
      }
      if (storeData.owner_id && isNaN(parseInt(storeData.owner_id))) {
        throw new Error('Owner ID must be a valid number');
      }
      const data = await adminAPI.addStore(storeData);
      console.log('Add store response:', data);
      if (data.error) {
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setSuccess('Store added successfully!');
        setShowAddStore(false);
        loadStores(storeFilters, storeSort);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Add store error:', err);
      setError(err.message || 'Failed to add store');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUserFilter = () => {
    loadUsers(userFilters, userSort);
  };

  const handleStoreFilter = () => {
    loadStores(storeFilters, storeSort);
  };

  const handleUserSort = (field) => {
    const [currentField, currentOrder] = userSort.split(' ');
    const newOrder = currentField === field && currentOrder === 'asc' ? 'desc' : 'asc';
    const newSort = `${field} ${newOrder}`;
    setUserSort(newSort);
    loadUsers(userFilters, newSort);
  };

  const handleStoreSort = (field) => {
    const [currentField, currentOrder] = storeSort.split(' ');
    const newOrder = currentField === field && currentOrder === 'asc' ? 'desc' : 'asc';
    const newSort = `${field} ${newOrder}`;
    setStoreSort(newSort);
    loadStores(storeFilters, newSort);
  };

  const viewUserDetails = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const user = await adminAPI.getUserDetails(userId);
      console.log('User details response:', user);
      if (user.error) {
        setError(user.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setSelectedUser(user);
      }
    } catch (err) {
      console.error('User details error:', err);
      setError('Failed to load user details');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const viewStoreDetails = async (storeId) => {
    setLoading(true);
    setError('');
    try {
      const store = await adminAPI.getStoreDetails(storeId);
      console.log('Store details response:', store);
      if (store.error) {
        setError(store.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setSelectedStore(store);
      }
    } catch (err) {
      console.error('Store details error:', err);
      setError('Failed to load store details');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      onLogout();
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      onLogout();
    }
  };

  const renderDashboard = () => (
    <div style={styles.dashboard}>
      <h2 style={styles.sectionTitle}>Dashboard Overview</h2>
      {loading && <p style={styles.loading}>Loading...</p>}
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{dashboardData.totalUsers || 0}</h3>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{dashboardData.totalStores || 0}</h3>
          <p style={styles.statLabel}>Total Stores</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{dashboardData.totalRatings || 0}</h3>
          <p style={styles.statLabel}>Total Ratings</p>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Manage Users</h2>
      <button onClick={() => setShowAddUser(true)} style={styles.button}>
        Add New User
      </button>
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Filter by name"
          value={userFilters.name}
          onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
          style={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filter by email"
          value={userFilters.email}
          onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
          style={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filter by address"
          value={userFilters.address}
          onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
          style={styles.filterInput}
        />
        <select
          value={userFilters.role}
          onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
          style={styles.filterSelect}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="normal">Normal</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button onClick={handleUserFilter} style={styles.filterButton}>Apply Filters</button>
        <button onClick={() => loadUsers()} style={styles.button}>Refresh</button>
      </div>
      {loading ? <p style={styles.loading}>Loading...</p> : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleUserSort('name')}>
                  Name {userSort.startsWith('name') && (userSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleUserSort('email')}>
                  Email {userSort.startsWith('email') && (userSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleUserSort('role')}>
                  Role {userSort.startsWith('role') && (userSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleUserSort('address')}>
                  Address {userSort.startsWith('address') && (userSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>{user.address}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => viewUserDetails(user.id)} 
                      style={styles.actionButton}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderStores = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Manage Stores</h2>
      <button onClick={() => setShowAddStore(true)} style={styles.button}>
        Add New Store
      </button>
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Filter by name"
          value={storeFilters.name}
          onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
          style={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filter by email"
          value={storeFilters.email}
          onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
          style={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filter by address"
          value={storeFilters.address}
          onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
          style={styles.filterInput}
        />
        <button onClick={handleStoreFilter} style={styles.filterButton}>Apply Filters</button>
        <button onClick={() => loadStores()} style={styles.button}>Refresh</button>
      </div>
      {loading ? <p style={styles.loading}>Loading...</p> : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleStoreSort('name')}>
                  Name {storeSort.startsWith('name') && (storeSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleStoreSort('email')}>
                  Email {storeSort.startsWith('email') && (storeSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleStoreSort('address')}>
                  Address {storeSort.startsWith('address') && (storeSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleStoreSort('avg_rating')}>
                  Rating {storeSort.startsWith('avg_rating') && (storeSort.includes('asc') ? '↑' : '↓')}
                </th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id} style={styles.tr}>
                  <td style={styles.td}>{store.name}</td>
                  <td style={styles.td}>{store.email}</td>
                  <td style={styles.td}>{store.address}</td>
                  <td style={styles.td}>
                    {typeof store.avg_rating === 'number' && !isNaN(store.avg_rating)
                      ? store.avg_rating.toFixed(1) + '/5'
                      : 'No ratings'}
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => viewStoreDetails(store.id)} 
                      style={styles.actionButton}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </header>
      <nav style={styles.nav}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={activeTab === 'dashboard' ? styles.activeTab : styles.tab}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          style={activeTab === 'users' ? styles.activeTab : styles.tab}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('stores')} 
          style={activeTab === 'stores' ? styles.activeTab : styles.tab}
        >
          Stores
        </button>
        <button 
          onClick={() => setActiveTab('admins')} 
          style={activeTab === 'admins' ? styles.activeTab : styles.tab}
        >
          Admins
        </button>
      </nav>
      <main style={styles.main}>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'stores' && renderStores()}
        {activeTab === 'admins' && renderAdmins()}
      </main>
      {showAddUser && (
        <AddUserModal 
          onClose={() => setShowAddUser(false)} 
          onSubmit={handleAddUser} 
        />
      )}
      {showAddStore && (
        <AddStoreModal 
          onClose={() => setShowAddStore(false)} 
          onSubmit={handleAddStore} 
        />
      )}
      {showAddAdmin && (
        <AddAdminModal 
          onClose={() => setShowAddAdmin(false)} 
          onSubmit={handleAddAdmin} 
        />
      )}
      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
      {selectedStore && (
        <StoreDetailsModal 
          store={selectedStore} 
          onClose={() => setSelectedStore(null)} 
        />
      )}
    </div>
  );
};

// Add Store Modal Component
const AddStoreModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '', // Added password field
    owner_id: ''
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.name.length > 100) {
      setFormError('Store name must be 1-100 characters');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Invalid store email format');
      return;
    }
    if (!formData.address || formData.address.length > 400) {
      setFormError('Store address must be 1-400 characters');
      return;
    }
    if (!formData.password || !/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(formData.password)) {
      setFormError('Password must be 8-16 characters with at least one uppercase and one special character');
      return;
    }
    if (formData.owner_id && isNaN(parseInt(formData.owner_id))) {
      setFormError('Owner ID must be a valid number');
      return;
    }
    setFormError('');
    onSubmit(formData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>Add New Store</h3>
        {formError && <div style={styles.error}>{formError}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Store Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Store Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Store Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Store Password (8-16 chars, uppercase + special)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            minLength="8"
            maxLength="16"
            required
          />
          <input
            type="number"
            placeholder="Owner ID (optional)"
            value={formData.owner_id}
            onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
            style={styles.input}
          />
          <div style={styles.modalButtons}>
            <button type="submit" style={styles.button}>Add Store</button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add User Modal Component
const AddUserModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal'
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z\s]{20,60}$/.test(formData.name)) {
      setFormError('Name must be 20-60 characters, letters and spaces only');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Invalid email format');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(formData.password)) {
      setFormError('Password must be 8-16 characters with at least one uppercase and one special character');
      return;
    }
    if (formData.address.length > 400) {
      setFormError('Address must not exceed 400 characters');
      return;
    }
    setFormError('');
    onSubmit(formData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>Add New User</h3>
        {formError && <div style={styles.error}>{formError}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name (20-60 characters)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            minLength="20"
            maxLength="60"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password (8-16 chars, uppercase + special)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            minLength="8"
            maxLength="16"
            required
          />
          <input
            type="text"
            placeholder="Address (max 400 characters)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={styles.input}
            maxLength="400"
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={styles.select}
            required
          >
            <option value="normal">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
          <div style={styles.modalButtons}>
            <button type="submit" style={styles.button}>Add User</button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>User Details</h3>
        <div style={styles.detailsContainer}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Address:</strong> {user.address}</p>
          {user.role === 'store_owner' && user.avgRating && (
            <p><strong>Store Rating:</strong> {typeof user.avgRating === 'number' ? user.avgRating.toFixed(1) + '/5' : 'No ratings'}</p>
          )}
        </div>
        <button onClick={onClose} style={styles.button}>Close</button>
      </div>
    </div>
  );
};

// Store Details Modal Component
const StoreDetailsModal = ({ store, onClose }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>Store Details</h3>
        <div style={styles.detailsContainer}>
          <p><strong>Name:</strong> {store.name}</p>
          <p><strong>Email:</strong> {store.email}</p>
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Average Rating:</strong> {typeof store.avg_rating === 'number' && !isNaN(store.avg_rating) ? store.avg_rating.toFixed(1) + '/5' : 'No ratings'}</p>
        </div>
        <button onClick={onClose} style={styles.button}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { 
    backgroundColor: '#333', 
    color: 'white', 
    padding: '20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { margin: 0, fontSize: '24px' },
  logoutButton: { 
    backgroundColor: '#dc3545', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '6px', 
    cursor: 'pointer' 
  },
  nav: { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderBottom: '1px solid #ddd',
    display: 'flex',
    gap: '10px'
  },
  tab: { 
    padding: '10px 20px', 
    border: '1px solid #ddd', 
    backgroundColor: 'white', 
    cursor: 'pointer',
    borderRadius: '6px'
  },
  activeTab: { 
    padding: '10px 20px', 
    border: '1px solid #4a90e2', 
    backgroundColor: '#4a90e2', 
    color: 'white',
    cursor: 'pointer',
    borderRadius: '6px'
  },
  main: { padding: '20px' },
  error: { 
    backgroundColor: '#fee', 
    color: '#c33', 
    padding: '12px', 
    borderRadius: '6px', 
    marginBottom: '20px' 
  },
  success: { 
    backgroundColor: '#efe', 
    color: '#363', 
    padding: '12px', 
    borderRadius: '6px', 
    marginBottom: '20px' 
  },
  dashboard: { marginBottom: '30px' },
  sectionTitle: { fontSize: '24px', marginBottom: '20px', color: '#333' },
  statsGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '20px' 
  },
  statCard: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '12px', 
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  statNumber: { fontSize: '36px', margin: '0 0 10px 0', color: '#4a90e2' },
  statLabel: { fontSize: '16px', color: '#666', margin: 0 },
  section: { marginBottom: '30px' },
  button: { 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '6px', 
    cursor: 'pointer',
    marginBottom: '20px'
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  filterInput: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '150px'
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '120px'
  },
  filterButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  actionButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  tableContainer: { overflowX: 'auto' },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  th: { 
    backgroundColor: '#f8f9fa', 
    padding: '15px', 
    textAlign: 'left', 
    borderBottom: '1px solid #ddd',
    fontWeight: '600'
  },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '15px', borderBottom: '1px solid #eee' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    minWidth: '400px',
    maxWidth: '500px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  detailsContainer: {
    marginBottom: '20px'
  },
  loading: { textAlign: 'center', color: '#666', fontSize: '16px' }
};

export default AdminPage;

// AddAdminModal Component
const AddAdminModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z\s]{20,60}$/.test(formData.name)) {
      setFormError('Name must be 20-60 characters, letters and spaces only');
      return;
    }
    if (!/^[^\\s@]+@[^\\s@]+\.[^\\s@]+$/.test(formData.email)) {
      setFormError('Invalid email format');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(formData.password)) {
      setFormError('Password must be 8-16 characters with at least one uppercase and one special character');
      return;
    }
    if (formData.address.length > 400) {
      setFormError('Address must not exceed 400 characters');
      return;
    }
    setFormError('');
    onSubmit(formData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>Add New Admin</h3>
        {formError && <div style={styles.error}>{formError}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name (20-60 characters)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            minLength="20"
            maxLength="60"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password (8-16 chars, uppercase + special)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            minLength="8"
            maxLength="16"
            required
          />
          <input
            type="text"
            placeholder="Address (max 400 characters)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={styles.input}
            maxLength="400"
            required
          />
          <div style={styles.modalButtons}>
            <button type="submit" style={styles.button}>Add Admin</button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};