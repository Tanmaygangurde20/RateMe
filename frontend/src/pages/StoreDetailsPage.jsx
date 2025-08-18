import React, { useState, useEffect } from 'react';
import { customerAPI, authAPI } from '../api.jsx';

const StoreDetailsPage = ({ storeId, onBack, onLogout }) => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (storeId) {
      loadStoreDetails();
    }
  }, [storeId]);

  const loadStoreDetails = async () => {
    setLoading(true);
    try {
      // Load store details and ratings
      const storeData = await customerAPI.getStoreDetails(storeId);
      setStore(storeData.store);
      setRatings(storeData.ratings || []);
    } catch (err) {
      setError('Failed to load store details');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerAPI.submitRating({
        store_id: storeId,
        rating: ratingForm.rating,
        comment: ratingForm.comment
      });
      
      setShowRatingForm(false);
      setRatingForm({ rating: 5, comment: '' });
      loadStoreDetails(); // Refresh data
      setSuccess('Rating submitted successfully!');
      setTimeout(() => setSuccess(''), 3000);
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

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading store details...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Store not found</div>
        <button onClick={onBack} style={styles.backButton}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={onBack} style={styles.backButton}>← Back</button>
          <h1 style={styles.title}>{store.name}</h1>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </header>

      <main style={styles.main}>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.storeInfo}>
          <div style={styles.storeCard}>
            <h2 style={styles.storeName}>{store.name}</h2>
            <p style={styles.storeAddress}>{store.address}</p>
            <div style={styles.ratingInfo}>
              <span style={styles.overallRating}>
                Overall Rating: {store.overall_rating ? store.overall_rating.toFixed(1) : 'No ratings'} 
                {store.overall_rating && <span style={styles.stars}>{renderStars(Math.round(store.overall_rating))}</span>}
              </span>
              <span style={styles.totalRatings}>
                Total Ratings: {ratings.length}
              </span>
            </div>
            <button 
              onClick={() => setShowRatingForm(true)}
              style={styles.rateButton}
            >
              Rate This Store
            </button>
          </div>
        </div>

        <div style={styles.ratingsSection}>
          <h2 style={styles.sectionTitle}>Customer Reviews</h2>
          {ratings.length === 0 ? (
            <div style={styles.noRatings}>
              <p>No reviews yet. Be the first to rate this store!</p>
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
                  <div style={styles.ratingDate}>
                    {new Date(rating.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showRatingForm && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>Rate {store.name}</h3>
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
                    onClick={() => setShowRatingForm(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  },
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
    border: '1px solid #cfc'
  },
  storeInfo: { marginBottom: '30px' },
  storeCard: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  storeName: { fontSize: '28px', margin: '0 0 15px 0', color: '#333' },
  storeAddress: { color: '#666', margin: '0 0 20px 0', fontSize: '16px' },
  ratingInfo: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px', 
    marginBottom: '25px',
    alignItems: 'center'
  },
  overallRating: { fontSize: '18px', color: '#4a90e2', fontWeight: '600' },
  totalRatings: { fontSize: '16px', color: '#666' },
  stars: { fontSize: '20px', marginLeft: '10px' },
  rateButton: { 
    backgroundColor: '#4a90e2', 
    color: 'white', 
    border: 'none', 
    padding: '12px 24px', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  },
  ratingsSection: { marginBottom: '30px' },
  sectionTitle: { fontSize: '24px', marginBottom: '20px', color: '#333' },
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
    paddingTop: '15px',
    marginBottom: '15px'
  },
  commentText: { 
    fontSize: '16px', 
    color: '#333', 
    margin: 0,
    fontStyle: 'italic'
  },
  ratingDate: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'right'
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

export default StoreDetailsPage;
