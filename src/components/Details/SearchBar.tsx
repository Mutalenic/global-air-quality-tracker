import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = React.memo(
  ({ value, onChange, placeholder = 'Search...' }) => {
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
  },
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
