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
import {
  Box, Paper, Typography, TextField, Button, ButtonGroup, ToggleButton, ToggleButtonGroup, Grid, Card, Chip, Pagination as MuiPagination, SpeedDial, SpeedDialAction,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
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

function getAQIColor(aqi) {
  if (aqi <= 50) return 'success';
  if (aqi <= 100) return 'warning';
  if (aqi <= 150) return 'error';
  return 'default';
}

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
        <Paper sx={{ p: 3, my: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h5" flexGrow={1}>{region}</Typography>
            <Suspense fallback={<div>Loading...</div>}>
              <OptimizedImage src={regionImage} alt={`Map of ${region}`} style={{ width: 48, height: 48, borderRadius: 8 }} />
            </Suspense>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => val && setViewMode(val)}
              size="small"
              sx={{ ml: 2 }}
            >
              <ToggleButton value="grid" aria-label="Grid View"><ViewModuleIcon /></ToggleButton>
              <ToggleButton value="map" aria-label="Map View"><MapIcon /></ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search country..."
              value={search}
              onChange={handleLocalSearchChange}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ flexGrow: 1, minWidth: 220 }}
            />
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={activeFilter === 'name' ? 'contained' : 'outlined'}
                onClick={() => handleFilter('name')}
              >
                Name
              </Button>
              <Button
                variant={activeFilter === 'population' ? 'contained' : 'outlined'}
                onClick={() => handleFilter('population')}
              >
                Population
              </Button>
            </ButtonGroup>
          </Box>
          {viewMode === 'grid' ? (
            <Grid container spacing={2} mt={1}>
              {displayCountries && displayCountries.length > 0 ? (
                displayCountries.map((country, index) => (
                  <Grid item xs={12} sm={6} md={4} key={country.cca2 || country.name?.common || index}>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <img src={country.flags?.png || country.flag || ''} alt="" style={{ width: 30 }} />
                        <Typography>{country.name?.common || country.name}</Typography>
                        <Chip label={`AQI ${country.aqi || '--'}`} color={getAQIColor(country.aqi)} />
                      </Card>
                    </Suspense>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}><Typography>No countries to display.</Typography></Grid>
              )}
            </Grid>
          ) : (
            <Box sx={{ minHeight: 400, my: 3 }}>
              <InteractiveWorldMap region={region} countries={displayCountries} />
            </Box>
          )}
          {!isDirectSearchMode && pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <MuiPagination
                count={pagination.totalPages}
                page={currentPage}
                onChange={(_, page) => handlePageChange(page)}
                color="primary"
              />
            </Box>
          )}
        </Paper>
        <SpeedDial
          ariaLabel="Quick Actions"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          icon={<SearchIcon />}
        >
          <SpeedDialAction
            icon={<SearchIcon />}
            tooltipTitle="Focus Search"
            onClick={() => document.querySelector('input[placeholder="Search country..."]')?.focus()}
          />
          <SpeedDialAction
            icon={<MapIcon />}
            tooltipTitle="Map View"
            onClick={() => setViewMode('map')}
          />
          <SpeedDialAction
            icon={<RefreshIcon />}
            tooltipTitle="Refresh"
            onClick={() => window.location.reload()}
          />
        </SpeedDial>
      </main>
    </ErrorBoundary>
  );
};

export default Countries;
