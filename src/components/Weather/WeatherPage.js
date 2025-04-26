import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Weather from './Weather';
import './WeatherPage.css';

const WeatherPage = () => {
  const [location, setLocation] = useState({
    latitude: 51.5074, // Default London
    longitude: -0.1278,
  });
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;

    setIsSearching(true);
    try {
      // Use OpenCage Geocoding API to convert location name to coordinates
      const apiEndpoint = 'https://api.opencagedata.com/geocode/v1/json';
      const queryParams = `?q=${encodeURIComponent(searchLocation)}&key=YOUR_API_KEY`;
      const response = await fetch(`${apiEndpoint}${queryParams}`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        setLocation({
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
        });
      } else {
        // Use a more user-friendly approach instead of alerts
        setError('Location not found. Please try a different search term.');
      }
    } catch (error) {
      // Log error and show user-friendly message
      setError('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="weather-page">
      <Navbar />

      <div className="weather-page-content">
        <div className="weather-header-section">
          <h1>Weather & Air Quality</h1>
          <p className="weather-subheading">
            Explore how weather conditions affect air quality around the world
          </p>

          <form className="location-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="location-search-input"
              disabled={isSearching}
            />
            <button
              type="submit"
              className="location-search-button"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && <div className="search-error">{error}</div>}
        </div>

        <div className="weather-component-container">
          <Weather latitude={location.latitude} longitude={location.longitude} />
        </div>

        <div className="weather-info-section">
          <h2>Understanding Weather & Air Quality</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Temperature</h3>
              <p>
                Higher temperatures accelerate reactions, increasing ground-level ozone formation.
                Cold temperatures can increase visible pollutants from vehicle exhaust.
              </p>
            </div>
            <div className="info-card">
              <h3>Wind</h3>
              <p>
                Strong winds disperse pollutants, improving air quality. Calm conditions
                trap pollutants, leading to stagnant air and poor quality.
              </p>
            </div>
            <div className="info-card">
              <h3>Precipitation</h3>
              <p>
                Rain and snow wash away particulate matter and water-soluble pollutants,
                generally improving air quality during and after precipitation events.
              </p>
            </div>
            <div className="info-card">
              <h3>Humidity</h3>
              <p>
                High humidity can affect pollutant formation and collection, while high-pressure
                systems can create stagnant air conditions, trapping pollutants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
