import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Africa from '../Maps/Africa.png';
import Antarctic from '../Maps/Antarctica.png';
import Asia from '../Maps/Asia.png';
import Europe from '../Maps/Europe.png';
import Oceania from '../Maps/Oceania.png';
import Navbar from '../Navbar/Navbar';
import America from '../Maps/America.png';
import { CountrySkeleton } from '../common/SkeletonLoaders';
import SearchBar from './SearchBar';
import RegionHeader from './RegionHeader';
import CountryList from './CountryList';
import SeeMoreButton from './SeeMoreButton';
import './Countries.css';
import './SearchBar.css';
import '../common/States.css';

// Map for region images
const regionImageMap = {
  Africa,
  Asia,
  Europe,
  Oceania,
  America,
  Americas: America,
  Antarctic,
};

const Countries = () => {
  const countriesData = useSelector((state) => {
    const data = state.countriesReducer;
    // Ensure new object reference to trigger re-renders
    return {
      countries: data?.countries || [],
      loading: data?.loading || false,
      error: data?.error || null,
    };
  });

  const { countries, loading, error } = countriesData;
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showMore, setShowMore] = useState(false);

  // Redirect to home if accessing /countries directly without data and not loading
  useEffect(() => {
    let timer;

    if (!loading && countries.length === 0) {
      timer = setTimeout(() => {
        if (countries.length === 0 && !loading) {
          navigate('/', { replace: true });
        }
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [loading, countries.length, navigate]);

  // Memoize the search handler
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setShowMore(false); // Reset show more when searching
  }, []);

  // Memoize the see more handler
  const handleSeeMore = useCallback(() => {
    setShowMore(true);
  }, []);

  // Memoize filtered and displayed countries
  const { searchedValue, displayedCountries } = useMemo(() => {
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    const displayed = showMore ? filtered : filtered.slice(0, 6);
    return {
      searchedValue: filtered,
      displayedCountries: displayed,
    };
  }, [countries, search, showMore]);

  // Memoize region image - handle case where countries might be empty initially
  const regionImage = useMemo(() => {
    if (countries.length === 0) return null;
    return regionImageMap[countries[0].region] || Antarctic;
  }, [countries]);

  // Show loading state
  if (loading) {
    return (
      <div>
        <Navbar id="/" />
        <CountrySkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="m-2">
        <Navbar id="/" />
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <NavLink to="/" className="reloadText">
            <p>Click to go back and try again</p>
            <FontAwesomeIcon icon={faRefresh} className="icon" text="reload" />
          </NavLink>
        </div>
      </div>
    );
  }

  // Show empty state - only if not loading and truly no countries
  if (countries.length === 0) {
    return (
      <div className="m-2">
        <Navbar id="/" />
        <div className="empty-container">
          <p>No countries available. Please select a region.</p>
          <NavLink to="/" className="reloadText">
            <p>Go back to regions</p>
            <FontAwesomeIcon icon={faRefresh} className="icon" />
          </NavLink>
        </div>
      </div>
    );
  }

  // Main render - we should have countries here
  const currentRegion = countries.length > 0 ? countries[0].region : 'Unknown';

  return (
    <div>
      <Navbar id="/" />
      <div className="countryContainer">
        <RegionHeader regionName={currentRegion} regionImage={regionImage} />
        <SearchBar value={search} onChange={handleSearchChange} placeholder="Search country" />
        <CountryList countries={displayedCountries} />
        {!showMore && searchedValue.length > 6 && (
          <SeeMoreButton onClick={handleSeeMore} remainingCount={searchedValue.length - 6} />
        )}
      </div>
    </div>
  );
};

export default Countries;
