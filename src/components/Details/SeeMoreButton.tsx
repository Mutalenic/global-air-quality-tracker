import React from 'react';

interface SeeMoreButtonProps {
  onClick: () => void;
  remainingCount: number;
}

/**
 * SeeMoreButton component for showing more countries
 */
const SeeMoreButton: React.FC<SeeMoreButtonProps> = React.memo(
  ({ onClick, remainingCount }) => {
    return (
      <button
        type="button"
        className="seeMoreButton"
        onClick={onClick}
        aria-label={`Show ${remainingCount} more countries`}
      >
        See More ({remainingCount} remaining)
      </button>
    );
  },
);

SeeMoreButton.displayName = 'SeeMoreButton';

export default SeeMoreButton;
