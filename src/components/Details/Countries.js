import React, { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
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
  const { countries, loading, error } = useSelector((state) => state.countriesReducer);
  const [search, setSearch] = useState('');
  const [showMore, setShowMore] = useState(false);

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
      country.name.common.toLowerCase().includes(search.toLowerCase()),
    );
    const displayed = showMore ? filtered : filtered.slice(0, 6);
    return { searchedValue: filtered, displayedCountries: displayed };
  }, [countries, search, showMore]);

  // Memoize region image
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

  // Show empty state
  if (!countries.length) {
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

  return (
    <div>
      <Navbar id="/" />
      <div className="countryContainer">
        <RegionHeader regionName={countries[0].region} regionImage={regionImage} />
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
