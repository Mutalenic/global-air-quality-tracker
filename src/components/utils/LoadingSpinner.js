import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner-container">
      <div className="spinner" />
    </div>
    <p className="loading-text">Loading air quality data...</p>
  </div>
);

export default LoadingSpinner;
