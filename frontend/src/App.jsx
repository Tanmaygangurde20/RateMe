import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setCurrentView('login');
  };

  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} token={token} onLogout={handleLogout} />;
      case 'normal':
        return <CustomerDashboard user={user} token={token} onLogout={handleLogout} />;
      case 'store_owner':
        return <StoreOwnerDashboard user={user} token={token} onLogout={handleLogout} />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  if (user && token) {
    return renderDashboard();
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => setCurrentView('login')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: currentView === 'login' ? '#007bff' : '#e9ecef',
              color: currentView === 'login' ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentView('signup')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: currentView === 'signup' ? '#007bff' : '#e9ecef',
              color: currentView === 'signup' ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        {currentView === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Signup onSignup={() => setCurrentView('login')} />
        )}
      </div>
    </div>
  );
}

export default App;