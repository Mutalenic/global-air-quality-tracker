import React from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

/**
 * SearchBar component for filtering countries
 * @param {string} value - Current search value
 * @param {function} onChange - Handler for search input change
 * @param {string} placeholder - Placeholder text
 */
const SearchBar = React.memo(({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder}
        className="searchCountry"
        onChange={onChange}
        value={value}
        aria-label="Search countries"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: 'Search...',
};

export default SearchBar;
