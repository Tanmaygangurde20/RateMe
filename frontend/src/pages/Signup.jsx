import React, { useState } from 'react';
import { authAPI } from '../api.jsx';

const Signup = ({ onSwitchToLogin, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [role] = useState('normal'); // Default role set to 'normal' and unchangeable
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    const { name, email, address, password, confirmPassword } = formData;
    
    if (!name || name.length < 20 || name.length > 60) {
      return 'Name must be between 20 and 60 characters';
    }
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'Please enter a valid email address';
    }
    
    if (!address || address.length > 400) {
      return 'Address must be maximum 400 characters';
    }
    
    if (!password || password.length < 8 || password.length > 16) {
      return 'Password must be between 8 and 16 characters';
    }
    
    if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$&*])/)) {
      return 'Password must contain at least one uppercase letter and one special character (!@#$&*)';
    }
    
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      const signupData = {
        ...formData,
        role: 'normal' // Always set role to 'normal'
      };
      
      const response = await authAPI.signup(signupData);
      
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Account created successfully! You can now log in.');
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false); // Fixed loading state to false
    }
  };

  // Role selection has been removed as we only allow normal users

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>Create Customer Account</h1>
          <p style={styles.subtitle}>
            Join RateStore as a Customer
          </p>
          <div style={styles.roleDisplay}>
            <span style={styles.roleBadge}>
              👤 Customer
            </span>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name (20-60 characters)"
              style={styles.input}
              required
            />
            <small style={styles.helpText}>
              Must be between 20 and 60 characters
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address (max 400 characters)"
              style={styles.textarea}
              rows="3"
              required
            />
            <small style={styles.helpText}>
              Maximum 400 characters
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
            <small style={styles.helpText}>
              8-16 characters, must include uppercase and special character
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading && styles.loadingButton)
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={styles.linkButton}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    top: '0',
    left: '0',
    background: 'rgba(74, 144, 226, 0.1)',
    border: 'none',
    color: '#4a90e2',
    padding: '8px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 20px 0'
  },
  roleDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '15px'
  },
  roleBadge: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  changeRoleButton: {
    background: 'none',
    border: '1px solid #4a90e2',
    color: '#4a90e2',
    padding: '6px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '15px',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  },
  textarea: {
    padding: '15px',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    fontSize: '16px',
    resize: 'vertical',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  },
  helpText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px'
  },
  submitButton: {
    padding: '16px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px'
  },
  loadingButton: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e1e5e9'
  },
  footerText: {
    color: '#666',
    margin: 0
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#4a90e2',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb'
  }
};

export default Signup;
