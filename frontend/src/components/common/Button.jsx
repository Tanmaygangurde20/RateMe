import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  style = {},
  ...props 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#6c757d' : '#007bff',
          color: 'white'
        };
      case 'success':
        return {
          backgroundColor: disabled ? '#6c757d' : '#28a745',
          color: 'white'
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#6c757d' : '#dc3545',
          color: 'white'
        };
      case 'warning':
        return {
          backgroundColor: disabled ? '#6c757d' : '#ffc107',
          color: 'white'
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#6c757d' : '#e9ecef',
          color: disabled ? 'white' : '#333'
        };
      default:
        return {
          backgroundColor: disabled ? '#6c757d' : '#007bff',
          color: 'white'
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { padding: '8px 12px', fontSize: '14px' };
      case 'large':
        return { padding: '12px 24px', fontSize: '16px' };
      default:
        return { padding: '10px 16px', fontSize: '14px' };
    }
  };

  const baseStyle = {
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...getSizeStyle(),
    ...getVariantStyle(),
    ...style
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
