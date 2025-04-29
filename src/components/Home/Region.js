import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faMapMarkerAlt,
  faChartBar,
  faGlobeAmericas,
  faSearch,
  faLungs,
  faClock,
  faExclamationTriangle,
  faMapMarkedAlt,
  faLayerGroup, // Icon for the trigger button
  faTimes, // Icon to close the menu
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Header from '../Navbar/Navbar';
import InteractiveWorldMap from '../Maps/InteractiveMap/InteractiveWorldMap';
import { fetchAllCountries } from '../../redux/apiFunctions';
import './Region.css';

const Regions = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const navigate = useNavigate();

  const regionList = [
    { region: 'Africa', country: 59 },
    { region: 'Americas', country: 56 },
    { region: 'Europe', country: 53 },
    { region: 'Asia', country: 50 },
    { region: 'Oceania', country: 27 },
    { region: 'Antarctic', country: 5 },
  ];

  // Fetch country options on mount
  useEffect(() => {
    const loadCountries = async () => {
      const options = await fetchAllCountries();
      setCountryOptions(options);
    };
    loadCountries();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Use selectedCountry.label for search term
    if (selectedCountry) {
      navigate(`/countries?search=${encodeURIComponent(selectedCountry.label)}&region=${selectedRegion || 'all'}`);
    }
  };

  const handleRegionClick = (regionName) => {
    // Map the clicked region to our application's region structure
    const regionMap = {
      'United States of America': 'Americas',
      Canada: 'Americas',
      Brazil: 'Americas',
      Mexico: 'Americas',
      'United Kingdom': 'Europe',
      France: 'Europe',
      Germany: 'Europe',
      Italy: 'Europe',
      Russia: 'Europe',
      China: 'Asia',
      India: 'Asia',
      Japan: 'Asia',
      Australia: 'Oceania',
      'New Zealand': 'Oceania',
      'South Africa': 'Africa',
      Egypt: 'Africa',
      Nigeria: 'Africa',
      Kenya: 'Africa',
      Antarctica: 'Antarctic',
    };

    const mappedRegion = regionMap[regionName] || '';
    if (mappedRegion) {
      navigate(`/countries?region=${mappedRegion}`);
    }
  };

  const handleRegionLinkClick = (regionName) => {
    navigate(`/countries?region=${regionName}`);
    setIsRegionMenuOpen(false); // Close menu on selection
  };

  // Filter country options based on selected region
  const filteredCountryOptions = selectedRegion
    ? countryOptions.filter((option) => option.region === selectedRegion)
    : countryOptions;

  return (
    <div className="home-container">
      <Header id="/" />

      {/* Hero Section with Interactive World Map */}
      <div className="hero-section">
        <div className="map-header-container">
          {/* Updated Title and Subtitle */}
          <h1 className="hero-title">Breathe Easier, Know Your Air</h1>
          <p className="hero-subtitle">Explore real-time air quality and weather conditions across the globe.</p>
        </div>

        <div className="world-container">
          <InteractiveWorldMap onRegionClick={handleRegionClick} />
        </div>

        {/* Why Use This Tracker? Section (Replaces App Intro) */}
        <div className="benefits-section">
          <h2>Why Track Air Quality?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <FontAwesomeIcon icon={faLungs} className="benefit-icon" />
              <h3>Protect Your Health</h3>
              <p>Understand pollution levels to make informed decisions for outdoor activities and reduce health risks.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faClock} className="benefit-icon" />
              <h3>Real-Time Data</h3>
              <p>Access up-to-the-minute air quality (AQI) and weather information from reliable sources.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="benefit-icon" />
              <h3>Global & Local Insights</h3>
              <p>Explore pollution trends worldwide or zoom in on specific countries and cities.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faExclamationTriangle} className="benefit-icon" />
              <h3>Stay Aware</h3>
              <p>Be informed about hazardous conditions and environmental changes affecting air quality.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Section */}
      <div className="search-section">
        <h2>Find Air Quality Data for a Specific Country</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <div className="search-field" style={{ flexGrow: 2 }}>
              {/* Allow select to grow */}
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              {/* Replace input with react-select */}
              <Select
                options={filteredCountryOptions}
                onChange={setSelectedCountry}
                value={selectedCountry}
                placeholder="Search for a country..."
                isClearable
                className="country-select"
                classNamePrefix="react-select"
              />
            </div>
            <div className="select-field">
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCountry(null); // Clear selected country when region changes
                }}
                className="region-select"
              >
                <option value="">All Regions</option>
                {regionList.map((region) => (
                  <option key={region.region} value={region.region}>
                    {region.region}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="search-button" disabled={!selectedCountry}>
            Search
          </button>
        </form>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FontAwesomeIcon icon={faGlobeAmericas} className="feature-icon" />
            <h3>Global Coverage</h3>
            <p>Air quality data for countries across all regions</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="feature-icon" />
            <h3>Location-Based</h3>
            <p>Find data specific to your region or country</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faChartBar} className="feature-icon" />
            <h3>Visual Analytics</h3>
            <p>Easy-to-understand pollution metrics</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faInfoCircle} className="feature-icon" />
            <h3>Health Insights</h3>
            <p>Learn how air quality affects your wellbeing</p>
          </div>
        </div>
      </div>

      {/* Remove the old static regions section */}
      {/*
      <div className="regions-section">
        <h2>Explore Air Quality by Region</h2>
        <p>Select a continent to view countries and their air quality data</p>
        <div className="row">
          {
            regionList.map((element) => (
              <Region
                key={element.region}
                region={element.region}
                regionCountry={element.country}
              />
            ))
          }
        </div>
      </div>
      */}

      {/* Floating Region Menu Trigger Button */}
      <button
        type="button"
        className="region-menu-trigger"
        onClick={() => setIsRegionMenuOpen(!isRegionMenuOpen)}
        aria-haspopup="true"
        aria-expanded={isRegionMenuOpen}
        aria-label="Open regions menu"
      >
        <FontAwesomeIcon icon={faLayerGroup} />
        <span>Regions</span>
      </button>

      {/* Floating Region Menu */}
      {isRegionMenuOpen && (
        <div className="floating-region-menu" role="menu">
          <button
            type="button"
            className="close-region-menu"
            onClick={() => setIsRegionMenuOpen(false)}
            aria-label="Close regions menu"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h3 className="floating-menu-title">Explore by Region</h3>
          <ul>
            {regionList.map((item) => (
              <li key={item.region}>
                <button
                  type="button"
                  className="floating-region-item"
                  onClick={() => handleRegionLinkClick(item.region)}
                  role="menuitem"
                >
                  {item.region}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Regions;
