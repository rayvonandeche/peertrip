import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      minHeight: '200px'
    }}>
      <div className="spinner" style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
      }}></div>
      <p style={{ color: '#666', fontSize: '1rem' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
