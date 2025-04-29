import React from "react";
import "./CountryDetail.css";

const AQISummary = () => (
  <section className="aqi-summary glass">
    <h2>National AQI: <span className="aqi-number">78</span></h2>
    <div className="trend-chart-placeholder">[7-day AQI Trend Chart]</div>
    <div className="health-advisory">💡 Sensitive groups should reduce outdoor activity.</div>
  </section>
);

const BestWorstCities = () => (
  <section className="best-worst-cities">
    <div className="best-city banner">
      ✅ Best: Livingstone (AQI 43)
    </div>
    <div className="worst-city banner">
      ❗ Worst: Kitwe (AQI 120)
    </div>
  </section>
);

const CityList = () => (
  <section className="city-list">
    {/* Example city card */}
    <div className="city-card">
      <div className="city-header">
        <span className="city-name">Lusaka</span>
        <span className="city-aqi good">56</span>
      </div>
      <div className="city-pollutant">PM2.5: 18 µg/m³</div>
      <div className="city-sparkline">[Sparkline]</div>
    </div>
    {/* Add more city cards as needed */}
  </section>
);

const FABMenu = () => (
  <div className="fab-menu">
    <button type="button" className="fab-main" aria-label="Open quick menu">＋</button>
    <div className="fab-actions">
      <button type="button" aria-label="Go to Map">🧭</button>
      <button type="button" aria-label="Copy Summary">📋</button>
      <button type="button" aria-label="View Trends">📊</button>
    </div>
  </div>
);

const CountryDetail = () => (
  <main className="country-detail-page">
    <AQISummary />
    <BestWorstCities />
    <CityList />
    <FABMenu />
  </main>
);

export default CountryDetail;
