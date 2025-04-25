/**
 * Web Worker for handling computationally intensive filtering and sorting operations
 * This keeps the main thread free to handle UI updates and user interactions
 */

// Handle messages from the main thread
self.onmessage = (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'FILTER_COUNTRIES':
      const { countries, searchTerm, sortField, sortDirection } = data;
      const result = filterAndSortCountries(countries, searchTerm, sortField, sortDirection);
      self.postMessage({ type: 'FILTER_RESULT', data: result });
      break;
    default:
      console.error('Unknown message type received in worker', type);
  }
};

/**
 * Filter and sort countries based on search term and sort parameters
 */
function filterAndSortCountries(countries, searchTerm, sortField, sortDirection) {
  console.time('worker-filter-sort');
  
  // First filter by search term
  let result = countries;
  
  if (searchTerm) {
    const lowercaseSearch = searchTerm.toLowerCase();
    result = countries.filter((country) => {
      const name = country.name.common.toLowerCase();
      return name.includes(lowercaseSearch);
    });
  }
  
  // Then sort by the specified field
  if (sortField) {
    result.sort((a, b) => {
      let valueA;
      let valueB;

      switch (sortField) {
        case 'name':
          valueA = a.name.common;
          valueB = b.name.common;
          break;
        case 'population':
          valueA = a.population;
          valueB = b.population;
          break;
        default:
          return 0;
      }

      if (typeof valueA === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return sortDirection === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    });
  }
  
  console.timeEnd('worker-filter-sort');
  return result;
}