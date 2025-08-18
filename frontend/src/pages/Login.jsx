import React, { useState } from 'react';
import { authAPI } from '../api.jsx';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      // Debug logging
      console.log('Login response:', response);
      
      if (response.error) {
        setError(response.error);
      } else {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userName', response.user.name);
        onLogin(response.user.role);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div style={styles.switchContainer}>
          <p style={styles.switchText}>
            Don't have an account?{' '}
            <button 
              onClick={onSwitchToSignup}
              style={styles.switchButton}
            >
              Sign up
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '8px',
    color: '#333',
    fontSize: '28px',
    fontWeight: '600'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '32px',
    color: '#666',
    fontSize: '16px'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid #fcc'
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
  },
  switchContainer: {
    textAlign: 'center',
    marginTop: '24px'
  },
  switchText: {
    color: '#666',
    fontSize: '14px'
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#4a90e2',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline'
  }
};

export default Login;
