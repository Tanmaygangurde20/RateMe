import React, { useState, useEffect } from 'react';
import { storeOwnerAPI, authAPI } from '../api.jsx';

const StoreOwnerPage = ({ onLogout }) => {
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    setLoading(true);
    try {
      const data = await storeOwnerAPI.getStoreRatings();
      setRatings(data.ratings || []);
      setAvgRating(data.avgRating || 0);
    } catch (err) {
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (!passwordData.newPassword.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/)) {
      setPasswordError('Password must be 8-16 characters with at least one uppercase letter and one special character');
      return;
    }

    try {
      await authAPI.updatePassword({ newPassword: passwordData.newPassword });
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setPasswordError('Failed to update password');
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Store Owner Dashboard</h1>
        <div style={styles.headerButtons}>
          <button onClick={() => setShowPasswordModal(true)} style={styles.updatePasswordButton}>
            Update Password
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.overviewSection}>
          <h2 style={styles.sectionTitle}>Store Overview</h2>
          <div style={styles.overviewCard}>
            <div style={styles.avgRating}>
              <h3 style={styles.avgRatingNumber}>
                {avgRating ? avgRating.toFixed(1) : '0.0'}
              </h3>
              <p style={styles.avgRatingLabel}>Average Rating</p>
              <div style={styles.stars}>
                {renderStars(Math.round(avgRating))}
              </div>
            </div>
            <div style={styles.totalRatings}>
              <h3 style={styles.totalNumber}>{ratings.length}</h3>
              <p style={styles.totalLabel}>Total Ratings</p>
            </div>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.ratingsSection}>
          <h2 style={styles.sectionTitle}>Customer Ratings</h2>
          <button onClick={loadRatings} style={styles.refreshButton}>Refresh Ratings</button>
          
          {loading ? (
            <p>Loading ratings...</p>
          ) : ratings.length === 0 ? (
            <div style={styles.noRatings}>
              <p>No ratings yet. Encourage customers to rate your store!</p>
            </div>
          ) : (
            <div style={styles.ratingsList}>
              {ratings.map(rating => (
                <div key={rating.id} style={styles.ratingCard}>
                  <div style={styles.ratingHeader}>
                    <div style={styles.customerInfo}>
                      <h4 style={styles.customerName}>{rating.name}</h4>
                      <p style={styles.customerEmail}>{rating.email}</p>
                    </div>
                    <div style={styles.ratingStars}>
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                  {rating.comment && (
                    <div style={styles.comment}>
                      <p style={styles.commentText}>"{rating.comment}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Update Password</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  style={styles.input}
                  placeholder="Enter new password"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  style={styles.input}
                  placeholder="Confirm new password"
                />
              </div>
              {passwordError && <div style={styles.error}>{passwordError}</div>}
              {passwordSuccess && <div style={styles.success}>{passwordSuccess}</div>}
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitButton}>Update Password</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    padding: '20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { margin: 0, fontSize: '24px' },
  headerButtons: {
    display: 'flex',
    gap: '15px'
  },
  updatePasswordButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  logoutButton: { 
    backgroundColor: '#dc3545', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '6px', 
    cursor: 'pointer' 
  },
  main: { padding: '20px' },
  overviewSection: { marginBottom: '30px' },
  sectionTitle: { fontSize: '24px', marginBottom: '20px', color: '#333' },
  overviewCard: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  avgRating: { textAlign: 'center' },
  avgRatingNumber: { 
    fontSize: '48px', 
    margin: '0 0 10px 0', 
    color: '#ffc107',
    fontWeight: 'bold'
  },
  avgRatingLabel: { 
    fontSize: '18px', 
    color: '#666', 
    margin: '0 0 15px 0' 
  },
  stars: { fontSize: '24px' },
  totalRatings: { textAlign: 'center' },
  totalNumber: { 
    fontSize: '36px', 
    margin: '0 0 10px 0', 
    color: '#4a90e2' 
  },
  totalLabel: { 
    fontSize: '16px', 
    color: '#666', 
    margin: 0 
  },
  error: { 
    backgroundColor: '#fee', 
    color: '#c33', 
    padding: '12px', 
    borderRadius: '6px', 
    marginBottom: '20px' 
  },
  ratingsSection: { marginBottom: '30px' },
  refreshButton: { 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '6px', 
    cursor: 'pointer',
    marginBottom: '20px'
  },
  noRatings: { 
    backgroundColor: 'white', 
    padding: '40px', 
    borderRadius: '12px',
    textAlign: 'center',
    color: '#666'
  },
  ratingsList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  ratingCard: { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  ratingHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  customerInfo: { flex: 1 },
  customerName: { 
    fontSize: '18px', 
    margin: '0 0 5px 0', 
    color: '#333' 
  },
  customerEmail: { 
    fontSize: '14px', 
    color: '#666', 
    margin: 0 
  },
  ratingStars: { 
    fontSize: '20px',
    color: '#ffc107'
  },
  comment: { 
    borderTop: '1px solid #eee', 
    paddingTop: '15px' 
  },
  commentText: { 
    fontSize: '16px', 
    color: '#333', 
    margin: 0,
    fontStyle: 'italic'
  },
  
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  },
  modalTitle: {
    fontSize: '24px',
    margin: '0 0 20px 0',
    color: '#333',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  modalButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};

export default StoreOwnerPage;
