import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCountriesStore } from '../../store/useAppStore';
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
const regionImageMap: Record<string, string> = {
  Africa,
  Asia,
  Europe,
  Oceania,
  America,
  Americas: America,
  Antarctic,
};

const Countries: React.FC = () => {
  const { countries, loading, error, selectedRegion } = useCountriesStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [selectedSubregion, setSelectedSubregion] = useState<string | null>(null);

  // Redirect to home if accessing /countries directly without a selected region
  useEffect(() => {
    if (!loading && !selectedRegion && countries.length === 0) {
      navigate('/', { replace: true });
    }
  }, [loading, selectedRegion, countries.length, navigate]);

  // Memoize the search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowMore(false); // Reset show more when searching
  }, []);

  // Memoize the see more handler
  const handleSeeMore = useCallback(() => {
    setShowMore(true);
  }, []);

  // Memoize filtered and displayed countries
  const { searchedValue, displayedCountries } = useMemo(() => {
    let filtered = countries;

    // Filter by subregion if one is selected
    if (selectedSubregion) {
      filtered = filtered.filter((c) => (c.subregion || 'Other') === selectedSubregion);
    }

    // Filter by search text
    if (search) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const displayed = showMore ? filtered : filtered.slice(0, 6);
    return {
      searchedValue: filtered,
      displayedCountries: displayed,
    };
  }, [countries, search, showMore, selectedSubregion]);

  // Memoize region image - handle case where countries might be empty initially
  const regionImage = useMemo(() => {
    if (countries.length === 0) return null;
    return regionImageMap[countries[0].region] || Antarctic;
  }, [countries]);

  // Show loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <CountrySkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="m-2">
        <Navbar />
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <NavLink to="/" className="reloadText">
            <p>Click to go back and try again</p>
            <FontAwesomeIcon icon={faRefresh} className="icon" />
          </NavLink>
        </div>
      </div>
    );
  }

  // Show empty state - only if not loading and truly no countries
  if (countries.length === 0) {
    return (
      <div className="m-2">
        <Navbar />
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

  // Main render - use selectedRegion from store or fallback to country data
  const currentRegion = selectedRegion || (countries.length > 0 ? countries[0].region : 'Unknown');

  return (
    <div>
      <Navbar />
      <div className="countryContainer">
        <RegionHeader
          regionName={currentRegion}
          regionImage={regionImage}
          countries={countries}
          selectedSubregion={selectedSubregion}
          onSelectSubregion={setSelectedSubregion}
        />
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
