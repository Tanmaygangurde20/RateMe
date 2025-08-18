import React, { useState, useEffect } from 'react';
import { customerAPI, authAPI } from '../api.jsx';

const CustomerPage = ({ onLogout, onViewStoreDetails, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState('stores');
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      loadStores();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Reload stores when filters change
  useEffect(() => {
    if (activeTab === 'stores') {
      loadStores();
    }
  }, [filters]);

  const loadStores = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await customerAPI.getStores(filters);
      console.log('Raw API response:', data); // Debug log
      
      // Ensure all stores have proper rating data with more robust validation
      const processedStores = (data || []).map(store => {
        // Convert overall_rating to number and handle null/undefined cases
        let overallRating = 0;
        if (store.overall_rating !== null && store.overall_rating !== undefined) {
          overallRating = parseFloat(store.overall_rating) || 0;
        }
        
        // Convert user_rating to number and handle null/undefined cases
        let userRating = null;
        if (store.user_rating !== null && store.user_rating !== undefined) {
          userRating = parseFloat(store.user_rating) || null;
        }
        
        return {
          ...store,
          overall_rating: overallRating,
          user_rating: userRating
        };
      });
      
      console.log('Processed stores:', processedStores); // Debug log
      // Filter out any null entries and ensure we have valid stores
      const validStores = processedStores.filter(store => store && store.id);
      setStores(validStores);
    } catch (err) {
      setError('Failed to load stores');
      console.error('Load stores error:', err);
      setStores([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadMyRatings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await customerAPI.getMyRatings();
      setMyRatings(data || []);
    } catch (err) {
      setError('Failed to load ratings');
      console.error('Load ratings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    loadStores();
  };

  const handleClearFilters = () => {
    setFilters({ name: '', address: '' });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;

    try {
      await customerAPI.submitRating({
        store_id: selectedStore.id,
        rating: ratingForm.rating,
        comment: ratingForm.comment
      });
      
      setSelectedStore(null);
      setRatingForm({ rating: 5, comment: '' });
      loadStores(); // Refresh to show updated rating
      
      // Show success message and redirect to stores view
      setSuccess('Rating submitted successfully! Redirecting to stores...');
      setTimeout(() => {
        setSuccess('');
        // Scroll to stores section
        document.getElementById('stores-section').scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    } catch (err) {
      setError('Failed to submit rating');
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

  const renderRatingModal = () => {
    if (!selectedStore) return null;

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <h3 style={styles.modalTitle}>Rate {selectedStore.name}</h3>
          <form onSubmit={handleRatingSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Rating:</label>
              <select
                value={ratingForm.rating}
                onChange={(e) => setRatingForm({...ratingForm, rating: parseInt(e.target.value)})}
                style={styles.select}
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Comment:</label>
              <textarea
                value={ratingForm.comment}
                onChange={(e) => setRatingForm({...ratingForm, comment: e.target.value})}
                style={styles.textarea}
                placeholder="Share your experience (optional)"
                maxLength="500"
                rows="3"
              />
            </div>
            <div style={styles.modalButtons}>
              <button type="submit" style={styles.submitButton}>Submit Rating</button>
              <button 
                type="button" 
                onClick={() => setSelectedStore(null)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add error boundary for the component
  if (error && !stores.length) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Customer Dashboard</h1>
          <div style={styles.headerActions}>
            <button onClick={onViewProfile} style={styles.profileButton}>Profile</button>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </div>
        </header>
        <main style={styles.main}>
          <div style={styles.error}>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={loadStores} style={styles.refreshButton}>Try Again</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
             <header style={styles.header}>
         <h1 style={styles.title}>Customer Dashboard</h1>
         <div style={styles.headerActions}>
           <button onClick={onViewProfile} style={styles.profileButton}>Profile</button>
           <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
         </div>
       </header>

      <main style={styles.main}>
        <nav style={styles.nav}>
          <button 
            onClick={() => setActiveTab('stores')} 
            style={activeTab === 'stores' ? styles.activeTab : styles.tab}
          >
            Browse Stores
          </button>
          <button 
            onClick={() => {
              setActiveTab('ratings');
              loadMyRatings();
            }} 
            style={activeTab === 'ratings' ? styles.activeTab : styles.tab}
          >
            My Ratings
          </button>
        </nav>

        {activeTab === 'stores' && (
          <>
            <div style={styles.searchSection}>
              <h2 style={styles.sectionTitle}>Find Stores</h2>
              <div style={styles.searchForm}>
                <input
                  type="text"
                  name="name"
                  placeholder="Search by store name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  style={styles.searchInput}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Search by address"
                  value={filters.address}
                  onChange={handleFilterChange}
                  style={styles.searchInput}
                />
                <button onClick={handleSearch} style={styles.searchButton}>Search</button>
                <button onClick={loadStores} style={styles.refreshButton}>Refresh</button>
                <button onClick={handleClearFilters} style={styles.clearButton}>Clear Filters</button>
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <div id="stores-section" style={styles.storesSection}>
              <h2 style={styles.sectionTitle}>Available Stores</h2>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={styles.loadingText}>Loading stores...</p>
                </div>
                             ) : (!Array.isArray(stores) || stores.length === 0) ? (
                <div style={styles.noStores}>
                  <p>No stores found matching your criteria.</p>
                  <button onClick={handleClearFilters} style={styles.clearButton}>Clear Filters</button>
                </div>
              ) : (
                                 <div style={styles.storesGrid}>
                                      {(stores || []).map(store => {
                     // Safety check for store object
                     if (!store || typeof store !== 'object') {
                       return null;
                     }
                     
                     return (
                       <div 
                         key={store.id || Math.random()} 
                         style={styles.storeCard}
                                            onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'translateY(-5px)';
                         e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'translateY(0)';
                         e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                       }}
                     >
                       <div style={styles.storeHeader}>
                         <h3 style={styles.storeName}>{store.name || 'Unnamed Store'}</h3>
                         <button 
                           onClick={() => store.id && onViewStoreDetails(store.id)}
                           style={styles.viewDetailsButton}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.backgroundColor = '#4a90e2';
                             e.currentTarget.style.color = 'white';
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.backgroundColor = 'transparent';
                             e.currentTarget.style.color = '#4a90e2';
                           }}
                         >
                           View Details
                         </button>
                       </div>
                       <p style={styles.storeAddress}>{store.address || 'No address provided'}</p>
                       <div style={styles.ratingInfo}>
                         <span style={styles.overallRating}>
                           Overall: {typeof store.overall_rating === 'number' && store.overall_rating > 0 ? store.overall_rating.toFixed(1) : 'No ratings'} ⭐
                         </span>
                         {typeof store.user_rating === 'number' && store.user_rating > 0 && (
                           <span style={styles.userRating}>
                             Your rating: {store.user_rating} ⭐
                           </span>
                         )}
                       </div>
                       <div style={styles.storeActions}>
                         <button 
                           onClick={() => setSelectedStore(store)}
                           style={styles.rateButton}
                         >
                           {typeof store.user_rating === 'number' && store.user_rating > 0 ? 'Update Rating' : 'Rate Store'}
                         </button>
                       </div>
                     </div>
                   );
                   })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'ratings' && (
          <div style={styles.ratingsSection}>
            <h2 style={styles.sectionTitle}>My Ratings</h2>
            {loading ? (
              <p>Loading ratings...</p>
            ) : myRatings.length === 0 ? (
              <div style={styles.noRatings}>
                <p>You haven't rated any stores yet.</p>
              </div>
            ) : (
              <div style={styles.ratingsList}>
                {myRatings.map(rating => (
                  <div key={rating.id} style={styles.ratingCard}>
                    <div style={styles.ratingHeader}>
                      <h4 style={styles.storeName}>{rating.store_name}</h4>
                      <p style={styles.storeAddress}>{rating.store_address}</p>
                    </div>
                    <div style={styles.ratingInfo}>
                      <span style={styles.ratingStars}>
                        {'⭐'.repeat(rating.rating) + '☆'.repeat(5 - rating.rating)}
                      </span>
                      <span style={styles.ratingDate}>
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
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
        )}

        {renderRatingModal()}
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
  title: { margin: 0, fontSize: '24px' },
  headerActions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
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
  searchSection: { marginBottom: '30px' },
  sectionTitle: { fontSize: '24px', marginBottom: '20px', color: '#333' },
  searchForm: { 
    display: 'flex', 
    gap: '15px', 
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: { 
    padding: '12px', 
    border: '2px solid #ddd', 
    borderRadius: '6px', 
    fontSize: '16px',
    minWidth: '200px'
  },
  searchButton: { 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    border: 'none', 
    padding: '12px 24px', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontSize: '16px'
  },
  refreshButton: { 
    backgroundColor: '#28a745', 
    color: 'white', 
    border: 'none', 
    padding: '12px 24px', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontSize: '16px'
  },
  clearButton: { 
    backgroundColor: '#6c757d', 
    color: 'white', 
    border: 'none', 
    padding: '12px 24px', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontSize: '16px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4a90e2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#666',
    fontSize: '16px',
    margin: 0
  },
  noStores: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#666',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
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
    marginBottom: '20px',
    textAlign: 'center',
  },
  nav: { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderBottom: '1px solid #ddd',
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
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
  ratingsSection: { marginBottom: '30px' },
  noRatings: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  ratingsList: {
    display: 'grid',
    gap: '20px'
  },
  ratingCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  ratingHeader: {
    marginBottom: '15px'
  },
  ratingStars: {
    fontSize: '18px',
    marginRight: '15px'
  },
  ratingDate: {
    color: '#666',
    fontSize: '14px'
  },
  comment: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  },
  commentText: {
    margin: 0,
    fontStyle: 'italic',
    color: '#555'
  },
  storesSection: { marginBottom: '30px' },
  storesGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
    gap: '20px' 
  },
  storeCard: { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  storeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  viewDetailsButton: {
    backgroundColor: 'transparent',
    color: '#4a90e2',
    border: '1px solid #4a90e2',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s'
  },
  storeName: { fontSize: '20px', margin: 0, color: '#333' },
  storeAddress: { color: '#666', margin: '0 0 15px 0' },
  ratingInfo: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '5px', 
    marginBottom: '15px' 
  },
  overallRating: { fontSize: '14px', color: '#4a90e2' },
  userRating: { fontSize: '14px', color: '#28a745' },
  rateButton: { 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '6px', 
    cursor: 'pointer',
    width: '100%'
  },
  storeActions: {
    marginTop: '15px'
  },
  modalOverlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '12px',
    maxWidth: '400px',
    width: '90%'
  },
  modalTitle: { margin: '0 0 20px 0', fontSize: '20px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '500' },
  select: { 
    width: '100%', 
    padding: '10px', 
    border: '2px solid #ddd', 
    borderRadius: '6px' 
  },
  textarea: { 
    width: '100%', 
    padding: '10px', 
    border: '2px solid #ddd', 
    borderRadius: '6px',
    resize: 'vertical'
  },
  modalButtons: { 
    display: 'flex', 
    gap: '10px', 
    justifyContent: 'flex-end' 
  },
  submitButton: { 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '6px', 
    cursor: 'pointer' 
  },
  cancelButton: { 
    backgroundColor: '#6c757d', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '6px', 
    cursor: 'pointer' 
  }
};

export default CustomerPage;
