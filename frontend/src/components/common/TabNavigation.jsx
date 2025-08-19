import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
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
    <div style={{ marginBottom: '20px' }}>
      {tabs.map(tab => (
        <button 
          key={tab.key}
          onClick={() => onTabChange(tab.key)} 
          style={tabStyle(activeTab === tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
