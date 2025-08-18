import React, { useState } from 'react';
import { authAPI } from '../api.jsx';

const ProfilePage = ({ onBack, onLogout, userRole }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return 'Password must be 8-16 characters long';
    }
    if (!password.match(/[A-Z]/)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!password.match(/[!@#$&*]/)) {
      return 'Password must contain at least one special character (!@#$&*)';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setError('Failed to update password');
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

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={onBack} style={styles.backButton}>← Back</button>
          <h1 style={styles.title}>Profile Settings</h1>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </header>

      <main style={styles.main}>
        <div style={styles.profileSection}>
          <h2 style={styles.sectionTitle}>Account Information</h2>
          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Role:</span>
              <span style={styles.infoValue}>{userRole === 'admin' ? 'System Administrator' : userRole === 'normal' ? 'Normal User' : 'Store Owner'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email:</span>
              <span style={styles.infoValue}>{localStorage.getItem('userEmail') || 'Not available'}</span>
            </div>
          </div>
        </div>

        <div style={styles.passwordSection}>
          <h2 style={styles.sectionTitle}>Change Password</h2>
          <div style={styles.formCard}>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter your current password"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter new password (8-16 chars, uppercase + special char)"
                />
                <small style={styles.helpText}>
                  Must be 8-16 characters with at least one uppercase letter and one special character (!@#$&*)
                </small>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Confirm your new password"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={loading ? styles.buttonDisabled : styles.button}
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
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
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
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
  main: { padding: '20px' },
  profileSection: { marginBottom: '30px' },
  sectionTitle: { fontSize: '24px', marginBottom: '20px', color: '#333' },
  infoCard: { 
    backgroundColor: 'white', 
    padding: '25px', 
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #eee'
  },
  infoLabel: { fontWeight: '600', color: '#333', fontSize: '16px' },
  infoValue: { color: '#666', fontSize: '16px' },
  passwordSection: { marginBottom: '30px' },
  formCard: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  error: { 
    backgroundColor: '#fee', 
    color: '#c33', 
    padding: '12px', 
    borderRadius: '6px', 
    marginBottom: '20px',
    border: '1px solid #fcc'
  },
  success: { 
    backgroundColor: '#efe', 
    color: '#363', 
    padding: '12px', 
    borderRadius: '6px', 
    marginBottom: '20px',
    border: '1px solid #cfc',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '500',
    color: '#333',
    fontSize: '14px'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  helpText: {
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic'
  },
  button: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    color: '#666',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed'
  }
};

export default ProfilePage;
