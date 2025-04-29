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
      <main className="weather-page-content">
        <section className="card" style={{ marginBottom: 32 }} aria-label="Weather and air quality search">
          <h1>Weather & Air Quality</h1>
          <p className="weather-subheading">
            Explore how weather conditions affect air quality around the world
          </p>
          <form className="location-search-form" onSubmit={handleSearch} style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
            <input
              type="text"
              placeholder="Search"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="location-search-input"
              disabled={isSearching}
              aria-label="Search for a location"
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={isSearching}
              aria-label="Search"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && <div className="search-error" role="alert">{error}</div>}
        </section>

        <section className="card weather-component-container" aria-label="Weather results" style={{ marginBottom: 32 }}>
          <Weather latitude={location.latitude} longitude={location.longitude} />
        </section>

        <section className="weather-info-section" aria-label="Weather and air quality info">
          <h2>Understanding Weather & Air Quality</h2>
          <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            <div className="card info-card">
              <h3>Temperature</h3>
              <p>
                Higher temperatures accelerate reactions, increasing ground-level ozone formation.
                Cold temperatures can increase visible pollutants from vehicle exhaust.
              </p>
            </div>
            <div className="card info-card">
              <h3>Wind</h3>
              <p>
                Strong winds disperse pollutants, improving air quality. Calm conditions
                trap pollutants, leading to stagnant air and poor quality.
              </p>
            </div>
            <div className="card info-card">
              <h3>Precipitation</h3>
              <p>
                Rain and snow wash away particulate matter and water-soluble pollutants,
                generally improving air quality during and after precipitation events.
              </p>
            </div>
            <div className="card info-card">
              <h3>Humidity</h3>
              <p>
                High humidity can affect pollutant formation and collection, while high-pressure
                systems can create stagnant air conditions, trapping pollutants.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WeatherPage;
