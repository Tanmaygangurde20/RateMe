import React, { useState } from 'react';

const RoleSelection = ({ onRoleSelect, onBack }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'normal',
      title: 'Customer',
      description: 'Rate stores and share your experiences',
      icon: '👤',
      features: [
        'Rate stores from 1-5 stars',
        'Write detailed reviews',
        'Search and discover stores',
        'Update your password',
        'View your rating history'
      ]
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Landing
        </button>
        <h1 style={styles.title}>Customer Registration</h1>
        <p style={styles.subtitle}>
          Sign up as a customer to rate stores and share your experiences
        </p>
        <div style={styles.adminNote}>
          <p style={styles.adminNoteText}>
            <strong>Note:</strong> Store Owners and System Administrators are added by administrators only. Please contact an administrator or use the login page directly if you already have an account.
          </p>
        </div>
      </div>

      <div style={styles.rolesContainer}>
        {roles.map((role) => (
          <div
            key={role.id}
            style={{
              ...styles.roleCard,
              ...(selectedRole === role.id && styles.selectedRoleCard)
            }}
            onClick={() => handleRoleSelect(role.id)}
          >
            <div style={styles.roleIcon}>{role.icon}</div>
            <h2 style={styles.roleTitle}>{role.title}</h2>
            <p style={styles.roleDescription}>{role.description}</p>
            
            <div style={styles.featuresList}>
              {role.features.map((feature, index) => (
                <div key={index} style={styles.feature}>
                  <span style={styles.checkmark}>✓</span>
                  {feature}
                </div>
              ))}
            </div>

            <button
              style={{
                ...styles.selectButton,
                ...(selectedRole === role.id && styles.selectedButton)
              }}
            >
              {selectedRole === role.id ? 'Selected' : 'Select Role'}
            </button>
          </div>
        ))}
      </div>

      {selectedRole && (
        <div style={styles.continueSection}>
          <p style={styles.continueText}>
            You've selected: <strong>{roles.find(r => r.id === selectedRole)?.title}</strong>
          </p>
          <button
            onClick={() => onRoleSelect(selectedRole)}
            style={styles.continueButton}
          >
            Continue with {roles.find(r => r.id === selectedRole)?.title}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
    paddingTop: '20px'
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    margin: '0 0 15px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: '20px',
    margin: '0 0 20px 0',
    opacity: 0.9,
    fontWeight: '300'
  },
  adminNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: '15px 25px',
    margin: '0 auto',
    maxWidth: '500px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  adminNoteText: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9
  },
  rolesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    border: '3px solid transparent'
  },
  selectedRoleCard: {
    borderColor: '#4a90e2',
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(74, 144, 226, 0.3)'
  },
  roleIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
  },
  roleTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 15px 0'
  },
  roleDescription: {
    fontSize: '18px',
    color: '#666',
    margin: '0 0 25px 0',
    lineHeight: '1.5'
  },
  featuresList: {
    textAlign: 'left',
    marginBottom: '30px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '16px',
    color: '#555'
  },
  checkmark: {
    color: '#4a90e2',
    fontWeight: 'bold',
    marginRight: '10px',
    fontSize: '18px'
  },
  selectButton: {
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
  selectedButton: {
    backgroundColor: '#28a745',
    transform: 'scale(1.05)'
  },
  continueSection: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    maxWidth: '600px',
    margin: '40px auto 0 auto'
  },
  continueText: {
    fontSize: '18px',
    color: '#333',
    margin: '0 0 20px 0'
  },
  continueButton: {
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
  }
};

export default RoleSelection;
