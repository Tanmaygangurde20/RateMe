import React from 'react';

const ErrorAlert = ({ error, onClear }) => {
  if (!error) return null;

  return (
    <div style={{
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '15px',
      border: '1px solid #f5c6cb'
    }}>
      {error}
      {onClear && (
        <button 
          onClick={onClear}
          style={{
            marginLeft: '10px',
            background: 'none',
            border: 'none',
            color: '#721c24',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
