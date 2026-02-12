import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullScreen = true }) => {
    return (
        <div className={fullScreen ? "loading-container" : "loading-container-inline"}>
            <div className="spinner"></div>
            <div className="loading-text">Loading Experience</div>
        </div>
    );
};

export default LoadingSpinner;
