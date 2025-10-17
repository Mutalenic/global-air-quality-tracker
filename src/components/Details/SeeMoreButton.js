import React from 'react';
import PropTypes from 'prop-types';

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

SeeMoreButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  remainingCount: PropTypes.number.isRequired,
};

export default SeeMoreButton;
