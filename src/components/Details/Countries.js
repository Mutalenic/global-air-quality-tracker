import React, {
  useState, useEffect, useMemo, Suspense,
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
  const { countries, loading, pagination } = useSelector((state) => state.countriesReducer);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [workerState, setWorkerState] = useState({ initialized: false, worker: null });

  // Get the region from URL query params
  const queryParams = new URLSearchParams(location.search);
  const region = queryParams.get('region') || 'Africa';

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

  // Load paginated countries when page changes
  useEffect(() => {
    dispatch(getPaginatedCountries(region, currentPage, 10));
  }, [dispatch, region, currentPage]);

  // Debounced search effect
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(search);
    }, 300);

    handler();
    return () => handler.clear();
  }, [search]);

  // Use web worker for filtering and sorting
  useEffect(() => {
    if (workerState.initialized && countries.length > 0) {
      // Send data to worker
      workerState.worker.postMessage({
        type: 'FILTER_COUNTRIES',
        data: {
          countries,
          searchTerm: debouncedSearch,
          sortField: activeFilter,
          sortDirection,
        },
      });
    }
  }, [countries, debouncedSearch, activeFilter, sortDirection, workerState]);

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

  if (loading) {
    return (
      <div className="loading-container">
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

  if (!countries.length) {
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

  // Get region image using the mapping
  const regionImage = regionToImageMap[region] || regionToImageMap.default;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        <Navbar id="/" />
        <div className="countryContainer">
          <div className="region-header">
            <h3>{region}</h3>
            <Suspense fallback={<div>Loading...</div>}>
              <OptimizedImage
                src={regionImage}
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
                onChange={(e) => setSearch(e.target.value)}
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

          {filteredCountries.length === 0 ? (
            <div className="no-results">No countries match your search criteria.</div>
          ) : (
            <>
              <div className="countriesGrid">
                <Suspense fallback={<div className="loading-container">Loading countries...</div>}>
                  {filteredCountries.map((country) => (
                    <Country
                      key={country.code}
                      id={country.code}
                      name={country.name.common}
                      lat={country.latlng[0]}
                      lng={country.latlng[1]}
                      population={country.population}
                      region={country.region}
                      flag={country.flag}
                    />
                  ))}
                </Suspense>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages || Math.ceil(filteredCountries.length / 10)}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Countries;
