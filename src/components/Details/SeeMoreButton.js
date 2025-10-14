import React from 'react';

/**
 * SeeMoreButton component for showing more countries
 * @param {function} onClick - Handler for button click
 * @param {number} remainingCount - Number of remaining items to show
 */
const SeeMoreButton = React.memo(({ onClick, remainingCount }) => {
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
});

SeeMoreButton.displayName = 'SeeMoreButton';

export default SeeMoreButton;
