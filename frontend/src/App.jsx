import React, { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminPage from './pages/AdminPage.jsx';
import CustomerPage from './pages/CustomerPage.jsx';
import StoreOwnerPage from './pages/StoreOwnerPage.jsx';
import StoreDetailsPage from './pages/StoreDetailsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  // Check authentication status and redirect to appropriate dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      setUserRole(role);
      setIsAuthenticated(true);
      setCurrentPage(role); // Redirect to appropriate dashboard
    }
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setCurrentPage(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUserRole(null);
    setIsAuthenticated(false);
    setCurrentPage('landing');
    setSelectedStoreId(null);
  };

  const handleViewStoreDetails = (storeId) => {
    setSelectedStoreId(storeId);
    setCurrentPage('store-details');
  };

  const handleBackToStores = () => {
    setSelectedStoreId(null);
    setCurrentPage('normal');
  };

  const handleViewProfile = () => {
    setCurrentPage('profile');
  };

  const renderNavbar = () => (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.navLogo} onClick={() => setCurrentPage('landing')}>
          <span style={styles.logoIcon}>⭐</span>
          <span style={styles.logoText}>RateStore</span>
        </div>
        
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </div>

        <div style={styles.navAuth}>
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => setCurrentPage('login')}
                style={styles.navButton}
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentPage('signup')}
                style={styles.navButtonPrimary}
              >
                Get Started
              </button>
            </>
          ) : (
            <div style={styles.userMenu}>
              <span style={styles.userRole}>
                {userRole === 'admin' ? 'Admin' : userRole === 'normal' ? 'Customer' : 'Store Owner'}
              </span>
              <button onClick={handleLogout} style={styles.navButton}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  const renderLandingPage = () => (
    <div style={styles.landingContainer}>
      {renderNavbar()}
      
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Discover & Rate the Best Stores
            <span style={styles.heroHighlight}> in Your Area</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Join thousands of users who share their experiences and help others find amazing stores. 
            Rate, review, and discover the perfect places for your needs.
          </p>
          <div style={styles.heroButtons}>
            <button 
              onClick={() => setCurrentPage('signup')}
              style={styles.heroButtonPrimary}
            >
              Start Rating Today
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              style={styles.heroButtonSecondary}
            >
              Already have an account?
            </button>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroCard}>
            <div style={styles.ratingStars}>⭐⭐⭐⭐⭐</div>
            <h3 style={styles.heroCardTitle}>Amazing Store!</h3>
            <p style={styles.heroCardText}>"Best experience ever! Highly recommended!"</p>
            <div style={styles.heroCardUser}>- Sarah M.</div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section style={styles.whoIsForSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Who Is RateStore For?</h2>
          <p style={styles.sectionSubtitle}>Three different experiences for different needs</p>
        </div>
        
        <div style={styles.rolesGrid}>
          <div style={styles.roleCard}>
            <div style={styles.roleIcon}>👤</div>
            <h3 style={styles.roleTitle}>Customers</h3>
            <p style={styles.roleDescription}>
              Discover amazing stores, read authentic reviews, and make informed decisions about where to shop.
            </p>
            <ul style={styles.roleFeatures}>
              <li>Rate stores from 1-5 stars</li>
              <li>Write detailed reviews and comments</li>
              <li>Search stores by name and location</li>
              <li>View overall ratings and user feedback</li>
              <li>Update your password anytime</li>
            </ul>
            <button 
              onClick={() => setCurrentPage('signup')}
              style={styles.roleButton}
            >
              Join as Customer
            </button>
          </div>
          
          <div style={styles.roleCard}>
            <div style={styles.roleIcon}>🏪</div>
            <h3 style={styles.roleTitle}>Store Owners</h3>
            <p style={styles.roleDescription}>
              Get valuable insights into customer satisfaction, track your store's performance, and understand what customers love about your business.
            </p>
            <ul style={styles.roleFeatures}>
              <li>View all customer ratings and reviews</li>
              <li>Track your store's average rating</li>
              <li>Monitor customer feedback trends</li>
              <li>Identify areas for improvement</li>
              <li>Manage your store information</li>
            </ul>
            <button 
              onClick={() => setCurrentPage('login')}
              style={styles.roleButton}
            >
              Join as Store Owner
            </button>
          </div>

          <div style={styles.roleCard}>
            <div style={styles.roleIcon}>👨‍💼</div>
            <h3 style={styles.roleTitle}>System Administrators</h3>
            <p style={styles.roleDescription}>
              Manage the entire platform, add users and stores, monitor system performance, and ensure smooth operations.
            </p>
            <ul style={styles.roleFeatures}>
              <li>Add new stores and users</li>
              <li>View comprehensive dashboards</li>
              <li>Monitor platform statistics</li>
              <li>Manage user roles and permissions</li>
              <li>System-wide oversight and control</li>
            </ul>
            <button 
              onClick={() => setCurrentPage('login')}
              style={styles.roleButton}
            >
              Admin Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Choose RateStore?</h2>
          <p style={styles.sectionSubtitle}>Everything you need to make informed decisions about where to shop</p>
        </div>
        
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⭐</div>
            <h3 style={styles.featureTitle}>Rate & Review</h3>
            <p style={styles.featureText}>
              Share your shopping experiences with detailed ratings and reviews. 
              Help other customers make better decisions.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔍</div>
            <h3 style={styles.featureTitle}>Smart Search</h3>
            <p style={styles.featureText}>
              Find stores by location, rating, or category. 
              Get personalized recommendations based on your preferences.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Analytics Dashboard</h3>
            <p style={styles.featureText}>
              Store owners get detailed insights into customer satisfaction, 
              ratings trends, and areas for improvement.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🚀</div>
            <h3 style={styles.featureTitle}>Real-time Updates</h3>
            <p style={styles.featureText}>
              Get instant notifications about new reviews, 
              rating changes, and store updates in your area.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorksSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Get started in just a few simple steps</p>
        </div>
        
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Choose Your Role</h3>
            <p style={styles.stepText}>Decide if you're a customer, store owner, or admin</p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Create Account</h3>
            <p style={styles.stepText}>Sign up with your details and role</p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Start Using</h3>
            <p style={styles.stepText}>Rate stores, view feedback, or manage the platform</p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>4</div>
            <h3 style={styles.stepTitle}>Help Others</h3>
            <p style={styles.stepText}>Your input helps the community grow</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p style={styles.ctaSubtitle}>
            Join our community of store raters and discover amazing places together
          </p>
          <div style={styles.ctaButtons}>
            <button 
              onClick={() => setCurrentPage('signup')}
              style={styles.ctaButtonPrimary}
            >
              Create Free Account
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              style={styles.ctaButtonSecondary}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>RateStore</h3>
            <p style={styles.footerText}>
              Your trusted platform for discovering and rating the best stores in your area.
            </p>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Quick Links</h4>
            <a href="#features" style={styles.footerLink}>Features</a>
            <a href="#about" style={styles.footerLink}>About Us</a>
            <a href="#contact" style={styles.footerLink}>Contact</a>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Support</h4>
            <a href="#" style={styles.footerLink}>Help Center</a>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <a href="#" style={styles.footerLink}>Terms of Service</a>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>© 2024 RateStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return renderLandingPage();
      case 'login':
        return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} onBack={() => setCurrentPage('landing')} />;
      case 'signup':
        return <Signup onSwitchToLogin={() => setCurrentPage('login')} onBack={() => setCurrentPage('landing')} />;
      case 'admin':
        return <AdminPage onLogout={handleLogout} />;
      case 'normal':
        return <CustomerPage onLogout={handleLogout} onViewStoreDetails={handleViewStoreDetails} onViewProfile={handleViewProfile} />;
      case 'store_owner':
        return <StoreOwnerPage onLogout={handleLogout} />;
      case 'store-details':
        return <StoreDetailsPage storeId={selectedStoreId} onBack={handleBackToStores} onLogout={handleLogout} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage(userRole)} onLogout={handleLogout} userRole={userRole} />;
      default:
        return renderLandingPage();
    }
  };

  return (
    <div style={styles.app}>
      {renderCurrentPage()}
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  
  // Navbar
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  },
  logoIcon: {
    fontSize: '32px',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4a90e2',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },
  navLinks: {
    display: 'flex',
    gap: '30px'
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  },
  navAuth: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#4a90e2',
    border: '2px solid #4a90e2',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  navButtonPrimary: {
    padding: '12px 24px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userRole: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a90e2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: '6px 12px',
    borderRadius: '15px'
  },
  
  // Landing Page
  landingContainer: {
    minHeight: '100vh'
  },
  
  // Hero Section
  heroSection: {
    background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
    padding: '120px 20px 80px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '80vh',
    color: 'white'
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    margin: '0 0 20px 0',
    lineHeight: '1.2'
  },
  heroHighlight: {
    color: '#FFD700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  heroSubtitle: {
    fontSize: '20px',
    margin: '0 0 30px 0',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  heroButtonPrimary: {
    padding: '18px 36px',
    backgroundColor: '#FFD700',
    color: '#333',
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
  },
  heroButtonSecondary: {
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  heroVisual: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '30px',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '300px'
  },
  ratingStars: {
    fontSize: '32px',
    marginBottom: '15px'
  },
  heroCardTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 15px 0'
  },
  heroCardText: {
    fontSize: '16px',
    margin: '0 0 15px 0',
    fontStyle: 'italic',
    opacity: 0.9
  },
  heroCardUser: {
    fontSize: '14px',
    opacity: 0.8
  },
  
  // Section Headers
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 20px 0'
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#666',
    margin: 0,
    lineHeight: '1.6'
  },
  
  // Who Is This For Section
  whoIsForSection: {
    padding: '80px 20px',
    backgroundColor: '#f8f9fa'
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: '50px'
  },
  roleCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '2px solid transparent'
  },
  roleIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
  },
  roleTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 15px 0'
  },
  roleDescription: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 25px 0'
  },
  roleFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 30px 0',
    textAlign: 'left'
  },
  roleButton: {
    padding: '15px 30px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%'
  },
  
  // Features Section
  featuresSection: {
    padding: '80px 20px',
    backgroundColor: 'white'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
  },
  featureTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 15px 0'
  },
  featureText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    margin: 0
  },
  
  // How It Works Section
  howItWorksSection: {
    padding: '80px 20px',
    backgroundColor: '#f8f9fa'
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  step: {
    textAlign: 'center'
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    backgroundColor: '#4a90e2',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 auto 20px auto'
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 15px 0'
  },
  stepText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    margin: 0
  },
  
  // CTA Section
  ctaSection: {
    padding: '80px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    textAlign: 'center'
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 20px 0'
  },
  ctaSubtitle: {
    fontSize: '18px',
    margin: '0 0 40px 0',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaButtonPrimary: {
    padding: '18px 36px',
    backgroundColor: '#FFD700',
    color: '#333',
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
  },
  ctaButtonSecondary: {
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  // Footer
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: '60px 20px 30px 20px',
    marginTop: '80px'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  footerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4a90e2',
    margin: '0 0 15px 0'
  },
  footerSubtitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 15px 0'
  },
  footerText: {
    fontSize: '16px',
    lineHeight: '1.6',
    opacity: 0.8,
    margin: 0
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '30px',
    textAlign: 'center'
  },
  footerCopyright: {
    margin: 0,
    opacity: 0.7,
    fontSize: '14px'
  }
};

export default App;
