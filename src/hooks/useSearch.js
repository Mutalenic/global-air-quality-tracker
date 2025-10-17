import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for search functionality with filtering
 * @param {Array} items - Array of items to search through
 * @param {string} searchKey - Key to search in (e.g., 'name')
 * @returns {Object} Search state and filtered items
 */
const useSearch = (items, searchKey = 'name') => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    return items.filter((item) => {
      const value = item[searchKey];
      if (!value) return false;
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm, searchKey]);

  // Memoized search handler
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    clearSearch,
    filteredItems,
    hasResults: filteredItems.length > 0,
    isSearching: searchTerm.trim().length > 0,
  };
};

export default useSearch;
