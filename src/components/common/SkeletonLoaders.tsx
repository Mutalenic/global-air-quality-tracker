import React from 'react';
import './Skeleton.css';

export const CountrySkeleton: React.FC = () => (
  <div className="country-skeleton">
    {[...Array(6)].map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className="country-skeleton-card">
        <div className="skeleton country-skeleton-flag" />
        <div className="skeleton country-skeleton-name" />
        <div className="skeleton country-skeleton-population" />
        <div className="skeleton country-skeleton-button" />
      </div>
    ))}
  </div>
);

export const RegionSkeleton: React.FC = () => (
  <div className="region-skeleton">
    {[...Array(6)].map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className="region-skeleton-card">
        <div className="skeleton region-skeleton-map" />
        <div className="skeleton region-skeleton-name" />
        <div className="skeleton region-skeleton-count" />
      </div>
    ))}
  </div>
);

export const PollutionSkeleton: React.FC = () => (
  <div className="pollution-skeleton">
    <div className="skeleton pollution-skeleton-title" />
    <div className="pollution-skeleton-data">
      {[...Array(8)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className="skeleton pollution-skeleton-item" />
      ))}
    </div>
  </div>
);
