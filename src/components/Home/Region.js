import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faMapMarkerAlt,
  faChartBar,
  faGlobeAmericas,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Header from '../Navbar/Navbar';
import Region from '../Details/Region';
import World from '../Maps/img/worldmap.jpg';
import OptimizedImage from '../utils/OptimizedImage';
import './Region.css';

const Regions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const navigate = useNavigate();

  const regionList = [
    { region: 'Africa', country: 59 },
    { region: 'Americas', country: 56 },
    { region: 'Europe', country: 53 },
    { region: 'Asia', country: 50 },
    { region: 'Oceania', country: 27 },
    { region: 'Antarctic', country: 5 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/countries?search=${encodeURIComponent(searchTerm.trim())}&region=${selectedRegion || 'all'}`);
    }
  };

  return (
    <div className="home-container">
      <Header id="/" />

      {/* Hero Section with World Map */}
      <div className="hero-section">
        <div className="world-container">
          <OptimizedImage
            src={World}
            alt="world map"
            className="world-map"
          />
          <div className="centered">
            <h1 className="hero-title">Global Air Quality Tracker</h1>
            <p className="hero-subtitle">Monitor air pollution data worldwide in real-time</p>
          </div>
        </div>

        {/* App Introduction */}
        <div className="app-intro">
          <p>
            Access up-to-date air quality information for countries around the world.
            Make informed decisions about outdoor activities and understand environmental
            impacts on health.
          </p>
        </div>
      </div>

      {/* Quick Search Section */}
      <div className="search-section">
        <h2>Find Air Quality Data</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <div className="search-field">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="select-field">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
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
          <button type="submit" className="search-button">
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

      {/* Region Selection Section */}
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
    </div>
  );
};

export default Regions;
