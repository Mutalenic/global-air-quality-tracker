import React, {
  useState, useEffect, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RotatingLines } from 'react-loader-spinner';
import { ErrorBoundary } from 'react-error-boundary';
import debounce from 'debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotate,
  faSearch,
  faArrowDown,
  faArrowUp,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
// Import images normally but optimize their loading
import Africa from '../Maps/Africa.png';
import Antarctic from '../Maps/Antarctica.png';
import Asia from '../Maps/Asia.png';
import Europe from '../Maps/Europe.png';
import Oceania from '../Maps/Oceania.png';
import America from '../Maps/America.png';
import Navbar from '../Navbar/Navbar';
import OptimizedImage from '../utils/OptimizedImage';
import './Countries.css';

// Import pagination action
import { getPaginatedCountries } from '../../redux/Actions/Countries';
import { searchCountryByNameAPI } from '../../redux/apiFunctions'; // Import the new API function
import InteractiveWorldMap from '../Maps/InteractiveMap/InteractiveWorldMap';

// Use dynamic import for Country component which is rendered multiple times
const Country = React.lazy(() => import('../Home/Country'));

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-container">
    <h2>Something went wrong!</h2>
    <p>{error.message}</p>
    <button type="button" onClick={resetErrorBoundary}>Try again</button>
  </div>
);

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

// Create a Pagination component for reusability
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination-container">
    <button
      type="button"
      className="pagination-button"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 1}
    >
      <FontAwesomeIcon icon={faAngleLeft} />
    </button>
    <span className="pagination-info">
      Page
      {' '}
      {currentPage}
      {' '}
      of
      {' '}
      {totalPages}
    </span>
    <button
      type="button"
      className="pagination-button"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
    >
      <FontAwesomeIcon icon={faAngleRight} />
    </button>
  </div>
);

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

const Countries = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // Keep redux state for paginated browsing
  const { countries: paginatedCountries, loading: paginatedLoading, pagination } = useSelector((state) => state.countriesReducer);

  // Get the region and search term from URL query params
  const queryParams = new URLSearchParams(location.search);
  const region = queryParams.get('region') || 'Africa';
  const initialSearchTerm = queryParams.get('search') || '';

  const [search, setSearch] = useState(initialSearchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearchTerm);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCountries, setFilteredCountries] = useState([]); // For worker results when browsing
  const [workerState, setWorkerState] = useState({ initialized: false, worker: null });

  // State for direct search results and loading
  const [directSearchResults, setDirectSearchResults] = useState(null);
  const [directSearchLoading, setDirectSearchLoading] = useState(false);
  const [isDirectSearchMode, setIsDirectSearchMode] = useState(!!initialSearchTerm);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  // FAB state
  const [fabOpen, setFabOpen] = useState(false);

  // Region to image mapping
  const regionToImageMap = {
    Africa,
    Asia,
    Europe,
    Oceania,
    Americas: America,
    // Default for any other region
    default: Antarctic,
  };

  // Initialize the worker
  useEffect(() => {
    // Create a new worker
    const worker = new Worker(new URL('../../workers/countriesWorker.js', import.meta.url));

    // Set up message handler
    worker.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'FILTER_RESULT') {
        setFilteredCountries(data);
      }
    };

    // Store worker in state
    setWorkerState({ initialized: true, worker });

    // Cleanup function to terminate worker when component unmounts
    return () => {
      worker.terminate();
    };
  }, []);

  // Fetch data based on mode
  useEffect(() => {
    const urlSearchTerm = queryParams.get('search') || '';
    const urlRegion = queryParams.get('region') || 'Africa'; // Use consistent region fetching
    setIsDirectSearchMode(!!urlSearchTerm);

    if (urlSearchTerm) {
      // Direct search mode (unchanged)
      setDirectSearchLoading(true);
      setDirectSearchResults(null);
      searchCountryByNameAPI(urlSearchTerm)
        .then((data) => {
          const results = (urlRegion && urlRegion !== 'all')
            ? data.filter((country) => country.region === urlRegion) // Add parentheses
            : data;
          setDirectSearchResults(results);
        })
        .catch(() => setDirectSearchResults([]))
        .finally(() => setDirectSearchLoading(false));
      setFilteredCountries([]); // Clear browse state
    } else {
      // Browse Region mode: Fetch ALL countries for the region
      setDirectSearchResults(null); // Clear direct search results
      dispatch(getPaginatedCountries(urlRegion, currentPage, 10));
    }
    // Reset local search and filters when mode changes via URL
    setSearch(urlSearchTerm);
    setDebouncedSearch(urlSearchTerm);
    setActiveFilter(null);
    setSortDirection('asc');
    setCurrentPage(1);
  }, [location.search, dispatch]); // Rerun when URL search params change

  // Debounced search effect for LOCAL filtering (only when NOT in direct search mode)
  useEffect(() => {
    const handler = debounce(() => {
      if (!isDirectSearchMode) { // Only apply debounce/worker filter if not in direct search mode
        setDebouncedSearch(search);
      }
    }, 300);

    handler();
    return () => handler.clear();
  }, [search, isDirectSearchMode]);

  // Use web worker for filtering and sorting (only when NOT in direct search mode)
  useEffect(() => {
    if (workerState.initialized && paginatedCountries.length > 0 && !isDirectSearchMode) {
      workerState.worker.postMessage({
        type: 'FILTER_COUNTRIES',
        data: {
          countries: paginatedCountries, // Use paginatedCountries from redux state
          searchTerm: debouncedSearch,
          sortField: activeFilter,
          sortDirection,
        },
      });
    } else if (!isDirectSearchMode) {
      // If not direct search and no paginated countries yet, clear filtered list
      setFilteredCountries([]);
    }
  }, [paginatedCountries, debouncedSearch, activeFilter, sortDirection, workerState, isDirectSearchMode]);

  // Update local search state and switch mode if search is cleared
  const handleLocalSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearch(newSearchTerm);
    if (isDirectSearchMode && !newSearchTerm) {
      // If user clears the search that came from URL, switch back to browse mode
      setIsDirectSearchMode(false);
      setDirectSearchResults(null);
      // Trigger fetch for the first page of the current region
      setCurrentPage(1); // Reset to page 1
      dispatch(getPaginatedCountries(region, 1, 10));
    }
  };

  const handlePageChange = (newPage) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(newPage);
  };

  const handleFilter = (filter) => {
    if (activeFilter === filter) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setActiveFilter(filter);
      setSortDirection('asc');
    }
  };

  // Determine loading state based on mode
  const isLoading = isDirectSearchMode ? directSearchLoading : paginatedLoading;
  // Determine which list to display
  const displayCountries = isDirectSearchMode ? directSearchResults : filteredCountries;

  // Get region image using the mapping - Moved definition before usage
  const regionImage = regionToImageMap[region] || regionToImageMap.default;

  if (isLoading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <RotatingLines
          strokeColor="#4fa94d"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible
        />
        <p>Loading countries data...</p>
        <NavLink to="/" className="reloadText">
          <p>Click to reload if taking too long</p>
          <FontAwesomeIcon icon={faRotate} className="icon" />
        </NavLink>
      </div>
    );
  }

  // Handle no results found specifically for direct search
  if (isDirectSearchMode && !isLoading && (!displayCountries || displayCountries.length === 0)) {
    return (
      <div>
        <Navbar id="/" />
        <div className="countryContainer">
          <div className="region-header">
            <h3>{region}</h3>
            <Suspense fallback={<div>Loading...</div>}>
              <OptimizedImage
                src={regionImage} // Now defined
                alt={region}
                className="img1"
              />
            </Suspense>
          </div>
          <div className="search-filter-container">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search country..."
                className="searchCountry"
                onChange={handleLocalSearchChange} // Use updated handler
                value={search}
              />
            </div>
            <div className="filter-container">
              <button
                type="button"
                className={`filter-button ${activeFilter === 'name' ? 'active' : ''}`}
                onClick={() => handleFilter('name')}
              >
                Name
                {activeFilter === 'name' && (
                  sortDirection === 'asc'
                    ? <FontAwesomeIcon icon={faArrowUp} className="sort-icon" />
                    : <FontAwesomeIcon icon={faArrowDown} className="sort-icon" />
                )}
              </button>

              <button
                type="button"
                className={`filter-button ${activeFilter === 'population' ? 'active' : ''}`}
                onClick={() => handleFilter('population')}
              >
                Population
                {activeFilter === 'population' && (
                  sortDirection === 'asc'
                    ? <FontAwesomeIcon icon={faArrowUp} className="sort-icon" />
                    : <FontAwesomeIcon icon={faArrowDown} className="sort-icon" />
                )}
              </button>
            </div>
          </div>
          <div className="no-results">
            No countries found matching
            {' '}
            &quot;
            {initialSearchTerm}
            &quot;
            {' '}
            {region && region !== 'all'
              ? ` in the ${region} region.`
              : '.'}
          </div>
        </div>
      </div>
    );
  }

  // Handle no results for browsing/filtering mode
  if (!isDirectSearchMode && !paginatedLoading && displayCountries.length === 0 && debouncedSearch) {
    return (
      <div className="error-container">
        <p>No countries match your search criteria.</p>
        <NavLink to="/" className="reloadText">
          <p>Click to reload</p>
          <FontAwesomeIcon icon={faRotate} className="icon" />
        </NavLink>
      </div>
    );
  }

  // Handle initial load or error for paginated view
  if (!isDirectSearchMode && !paginatedLoading && !paginatedCountries.length && !debouncedSearch) {
    return (
      <div className="error-container">
        <p>No countries data available.</p>
        <NavLink to="/" className="reloadText">
          <p>Click to reload</p>
          <FontAwesomeIcon icon={faRotate} className="icon" />
        </NavLink>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <main>
        <Navbar id="/" />
        <section className="countryContainer" aria-label="Country list section">
          <header className="region-header">
            <h3>{region}</h3>
            <Suspense fallback={<div>Loading...</div>}>
              <OptimizedImage
                src={regionImage}
                alt={`Map of ${region}`}
                className="img1"
              />
            </Suspense>
            <button
              type="button"
              className="toggle-view-btn"
              aria-label={viewMode === 'grid' ? 'Switch to map view' : 'Switch to grid view'}
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            >
              {viewMode === 'grid' ? '🗺️ Map View' : '📋 List View'}
            </button>
          </header>

          <section className="search-filter-container" aria-label="Search and filter controls">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search country..."
                className="searchCountry"
                onChange={handleLocalSearchChange}
                value={search}
                aria-label="Search country by name"
              />
            </div>
            <div className="filter-container">
              <button
                type="button"
                className={`filter-button ${activeFilter === 'name' ? 'active' : ''}`}
                onClick={() => handleFilter('name')}
                aria-pressed={activeFilter === 'name'}
                aria-label="Sort by name"
              >
                Name
                {activeFilter === 'name' && (
                  sortDirection === 'asc'
                    ? <FontAwesomeIcon icon={faArrowUp} className="sort-icon" />
                    : <FontAwesomeIcon icon={faArrowDown} className="sort-icon" />
                )}
              </button>
              <button
                type="button"
                className={`filter-button ${activeFilter === 'population' ? 'active' : ''}`}
                onClick={() => handleFilter('population')}
                aria-pressed={activeFilter === 'population'}
                aria-label="Sort by population"
              >
                Population
                {activeFilter === 'population' && (
                  sortDirection === 'asc'
                    ? <FontAwesomeIcon icon={faArrowUp} className="sort-icon" />
                    : <FontAwesomeIcon icon={faArrowDown} className="sort-icon" />
                )}
              </button>
            </div>
          </section>

          {/* Toggle between grid and map view */}
          {(() => {
            if (viewMode === 'grid') {
              if (displayCountries && displayCountries.length > 0) {
                return (
                  <>
                    <section
                      className="countriesGrid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '24px',
                        margin: '32px 0',
                      }}
                      aria-label="List of countries"
                    >
                      <Suspense fallback={<div className="loading-container">Loading countries...</div>}>
                        {displayCountries.map((country) => (
                          <Country
                            key={country.cca2 || country.name?.common}
                            id={country.cca2}
                            name={country.name.common}
                            lat={country.latlng ? country.latlng[0] : 0}
                            lng={country.latlng ? country.latlng[1] : 0}
                            population={country.population}
                            region={country.region}
                            flag={country.flags?.png || country.flag || ''}
                          />
                        ))}
                      </Suspense>
                    </section>
                    {/* Only show pagination if NOT in direct search mode */}
                    {!isDirectSearchMode && pagination.totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                );
              }
              return <div className="no-results">No countries to display.</div>;
            }
            // Map view
            return (
              <div
                className="map-view-container"
                style={{
                  minHeight: 400,
                  margin: '32px 0',
                }}
              >
                <InteractiveWorldMap region={region} countries={displayCountries} />
              </div>
            );
          })()}
        </section>
        {/* Floating Action Button (FAB) */}
        <div
          className={`fab-menu${fabOpen ? ' open' : ''}`}
          style={{
            position: 'fixed',
            bottom: 70,
            right: 24,
            zIndex: 20,
          }}
        >
          <button
            type="button"
            className="fab-main"
            aria-label="Open quick menu"
            onClick={() => setFabOpen((open) => !open)}
          >
            ＋
          </button>
          <div
            className="fab-actions"
            style={{
              display: fabOpen ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <button type="button" aria-label="Search Country" onClick={() => document.querySelector('.searchCountry')?.focus()}>🔍</button>
            <button type="button" aria-label="Go to Map View" onClick={() => setViewMode('map')}>🧭</button>
            <button type="button" aria-label="Refresh Data" onClick={() => window.location.reload()}>🔄</button>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
};

export default Countries;
