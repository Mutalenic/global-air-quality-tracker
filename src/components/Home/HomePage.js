import React from 'react';
import './HomePage.css';

// Placeholder subcomponents
const HeroSection = () => (
  <div className="hero-section glass">
    <div className="logo">🌱 AirTrack</div>
    <button className="menu-btn" aria-label="Open settings menu">☰</button>
    <button className="location-btn" aria-label="Use my location">
      <span className="pulsing-dot" />
      {' '}
      Use My Location
    </button>
    <input
      className="search-bar"
      type="text"
      placeholder="🔍 Search by city or country..."
      aria-label="Search by city or country"
    />
  </div>
);

const AQIDisplay = () => (
  <div className="aqi-display glass">
    <div className="aqi-number" aria-live="polite">72</div>
    <div className="aqi-status">Moderate Air Quality in Lusaka</div>
    <div className="aqi-icon" aria-label="Wind cloud icon">🌬️</div>
  </div>
);

const PollutantCards = () => (
  <div className="pollutant-cards-scroll">
    {/* Example pollutant card */}
    <div className="pollutant-card" tabIndex={0} aria-label="PM2.5: 35 micrograms per cubic meter, steady">
      <span className="pollutant-icon">⚠️</span>
      <span className="pollutant-name">PM2.5</span>
      <span className="pollutant-value">35 µg/m³</span>
      <span className="pollutant-trend">→</span>
      <span className="pollutant-dot moderate" />
    </div>
    {/* Add more cards as needed */}
  </div>
);

const HealthAdvisory = () => (
  <div className="health-advisory glass" aria-live="polite">
    <span role="img" aria-label="Health advisory">💡</span>
    {' '}
    Reduce prolonged outdoor exertion.
  </div>
);

const ForecastSlider = () => (
  <div className="forecast-slider">
    {/* Example forecast tile */}
    <div className="forecast-tile">
      <span className="forecast-time">12:00</span>
      <span className="forecast-aqi">65</span>
      <span className="forecast-emoji">🌤️</span>
    </div>
    {/* Add more tiles as needed */}
  </div>
);

const BottomNav = () => (
  <nav className="bottom-nav" aria-label="Main navigation">
    <button aria-label="Home">🏠</button>
    <button aria-label="Map">🗺️</button>
    <button aria-label="Explore">🔎</button>
    <button aria-label="News">📰</button>
    <button aria-label="Settings">⚙️</button>
  </nav>
);

const FABMenu = () => (
  <div className="fab-menu">
    <button className="fab-main" aria-label="Open quick menu">＋</button>
    {/* Expanded actions (hidden by default, show on click) */}
    <div className="fab-actions">
      <button aria-label="Search City">🔍</button>
      <button aria-label="Set Health Sensitivity">👤</button>
      <button aria-label="Change Theme">🎨</button>
      <button aria-label="Share App">🔗</button>
    </div>
  </div>
);

const HomePage = () => (
  <main className="home-page">
    <HeroSection />
    <AQIDisplay />
    <PollutantCards />
    <HealthAdvisory />
    <ForecastSlider />
    <FABMenu />
    <BottomNav />
  </main>
);

export default HomePage;
