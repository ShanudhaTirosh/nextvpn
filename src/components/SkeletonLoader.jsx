import React from 'react';

const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'title':
        return <div className={`skeleton skeleton-title ${className}`}></div>;
      case 'card':
        return <div className={`skeleton skeleton-card ${className}`}></div>;
      case 'avatar':
        return <div className={`skeleton skeleton-avatar ${className}`}></div>;
      case 'text':
      default:
        return <div className={`skeleton skeleton-text ${className}`}></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
