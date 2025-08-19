import React, { useState, useEffect } from 'react';

const CustomerDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('stores');
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchFilters, setSearchFilters] = useState({ name: '', address: '' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (activeTab === 'stores') {
      fetchStores();
    } else if (activeTab === 'myRatings') {
      fetchMyRatings();
    }
  }, [activeTab]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchFilters);
      const response = await fetch(`http://localhost:5000/customer/stores?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      setError('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/customer/my-ratings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyRatings(data);
      }
    } catch (error) {
      setError('Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/customer/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...ratingForm,
          store_id: selectedStore.id
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Rating submitted successfully!');
        setSelectedStore(null);
        setRatingForm({ rating: 5, comment: '' });
        fetchStores();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to submit rating');
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
        <h1 style={{ margin: 0, color: '#333' }}>Customer Dashboard</h1>
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
        <button onClick={() => setActiveTab('stores')} style={tabStyle(activeTab === 'stores')}>
          Browse Stores
        </button>
        <button onClick={() => setActiveTab('myRatings')} style={tabStyle(activeTab === 'myRatings')}>
          My Ratings
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

      {activeTab === 'stores' && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Browse Stores</h2>
          
          {/* Search Filters */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <input
              type="text"
              placeholder="Search by store name"
              value={searchFilters.name}
              onChange={(e) => setSearchFilters({...searchFilters, name: e.target.value})}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <input
              type="text"
              placeholder="Search by address"
              value={searchFilters.address}
              onChange={(e) => setSearchFilters({...searchFilters, address: e.target.value})}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={fetchStores}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>

          {/* Stores List */}
          <div>
            {stores.map(store => (
              <div key={store.id} style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{store.name}</h3>
                  <p style={{ margin: '2px 0', color: '#666', fontSize: '14px' }}>
                    <strong>Address:</strong> {store.address}
                  </p>
                  <p style={{ margin: '2px 0', color: '#666', fontSize: '14px' }}>
                    <strong>Overall Rating:</strong> {store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : 'No ratings'}
                  </p>
                  {store.user_rating && (
                    <p style={{ margin: '2px 0', color: '#28a745', fontSize: '14px' }}>
                      <strong>Your Rating:</strong> {store.user_rating}/5
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedStore(store);
                    setRatingForm({
                      rating: store.user_rating || 5,
                      comment: store.user_comment || ''
                    });
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: store.user_rating ? '#ffc107' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '15px'
                  }}
                >
                  {store.user_rating ? 'Update Rating' : 'Rate Store'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'myRatings' && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>My Ratings</h2>
          {myRatings.length === 0 ? (
            <p>You haven't rated any stores yet.</p>
          ) : (
            <div>
              {myRatings.map(rating => (
                <div key={rating.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{rating.store_name}</h3>
                      <p style={{ margin: '2px 0', color: '#666', fontSize: '14px' }}>
                        <strong>Address:</strong> {rating.store_address}
                      </p>
                      {rating.comment && (
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                          <strong>Comment:</strong> {rating.comment}
                        </p>
                      )}
                      <p style={{ margin: '2px 0', fontSize: '12px', color: '#999' }}>
                        Rated on: {new Date(rating.created_at).toLocaleDateString()}
                      </p>
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
          )}
        </div>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Rate {selectedStore.name}</h3>
            <form onSubmit={submitRating}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating (1-5):</label>
                <select
                  value={ratingForm.rating}
                  onChange={(e) => setRatingForm({...ratingForm, rating: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment (optional):</label>
                <textarea
                  value={ratingForm.comment}
                  onChange={(e) => setRatingForm({...ratingForm, comment: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    minHeight: '80px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Submit Rating
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStore(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
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

export default CustomerDashboard;
