import React, { useState, useEffect } from 'react';

const StoreOwnerDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('ratings');
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '' });

  useEffect(() => {
    if (activeTab === 'ratings') {
      fetchRatings();
    }
  }, [activeTab]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/storeowner/ratings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRatingsData(data);
      } else {
        setError('Failed to fetch ratings data');
      }
    } catch (error) {
      setError('Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/storeowner/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Password updated successfully!');
        setPasswordForm({ newPassword: '' });
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: isActive ? '#007bff' : '#e9ecef',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer'
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>Store Owner Dashboard</h1>
        <div>
          <span style={{ marginRight: '15px', color: '#666' }}>Welcome, {user.name}</span>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('ratings')} style={tabStyle(activeTab === 'ratings')}>
          Store Ratings
        </button>
        <button onClick={() => setActiveTab('password')} style={tabStyle(activeTab === 'password')}>
          Change Password
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      {activeTab === 'ratings' && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Store Ratings & Reviews</h2>
          
          {ratingsData ? (
            <div>
              {/* Average Rating Display */}
              <div style={{
                backgroundColor: '#e3f2fd',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Average Rating</h3>
                <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#1976d2' }}>
                  {ratingsData.avgRating ? parseFloat(ratingsData.avgRating).toFixed(1) : 'No ratings yet'}
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                  Based on {ratingsData.ratings.length} review{ratingsData.ratings.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Individual Ratings */}
              {ratingsData.ratings.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>
                  No ratings received yet.
                </p>
              ) : (
                <div>
                  <h3 style={{ marginBottom: '15px' }}>Customer Reviews</h3>
                  <div>
                    {ratingsData.ratings.map(rating => (
                      <div key={rating.id} style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '15px',
                        backgroundColor: '#f9f9f9',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{rating.name}</h4>
                            <p style={{ margin: '2px 0', color: '#666', fontSize: '14px' }}>
                              <strong>Email:</strong> {rating.email}
                            </p>
                            {rating.comment && (
                              <p style={{
                                margin: '8px 0 0 0',
                                padding: '8px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                fontStyle: 'italic',
                                color: '#555',
                                fontSize: '14px'
                              }}>
                                "{rating.comment}"
                              </p>
                            )}
                          </div>
                          <div style={{
                            backgroundColor: rating.rating >= 4 ? '#28a745' : rating.rating >= 3 ? '#ffc107' : '#dc3545',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginLeft: '15px'
                          }}>
                            {rating.rating}/5
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : loading ? (
            <p style={{ textAlign: 'center' }}>Loading ratings...</p>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No data available</p>
          )}
        </div>
      )}

      {activeTab === 'password' && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Change Password</h2>
          <form onSubmit={updatePassword} style={{ maxWidth: '400px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                New Password:
              </label>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: '0 0 5px 0'
              }}>
                Must be 8-16 characters with at least one uppercase letter and one special character (!@#$&*)
              </p>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
