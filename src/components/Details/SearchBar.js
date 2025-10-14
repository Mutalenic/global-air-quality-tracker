import React from 'react';
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

export default SearchBar;
