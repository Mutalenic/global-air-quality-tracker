import React from 'react';
import PropTypes from 'prop-types';
import './Skeleton.css';

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text-short" />
  </div>
);

export const SkeletonList = ({ count = 6 }) => (
  <div className="skeleton-list">
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={`skeleton-card-${index}`} />
    ))}
  </div>
);

SkeletonList.propTypes = {
  count: PropTypes.number,
};

SkeletonList.defaultProps = {
  count: 6,
};

export const SkeletonPollution = () => (
  <div className="skeleton-pollution">
    <div className="skeleton skeleton-header" />
    <div className="skeleton skeleton-metric-large" />
    <div className="skeleton-metrics-grid">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={`skeleton-metric-${index}`} className="skeleton-metric-item">
          <div className="skeleton skeleton-metric-label" />
          <div className="skeleton skeleton-metric-value" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonText = ({ width = '100%', height = '20px' }) => (
  <div className="skeleton" style={{ width, height }} />
);

SkeletonText.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};

SkeletonText.defaultProps = {
  width: '100%',
  height: '20px',
};
