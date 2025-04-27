import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { fetchCombinedWeatherAndAirQuality, getOpenAQLatest } from '../../../redux/Actions/Weather';
import './InteractiveWorldMap.css';

const geoUrl = '/world-countries.json';

// Define major cities with coordinates for air quality and weather data
const majorCities = [
  { name: 'New York', coordinates: [-74.0060, 40.7128], country: 'United States' },
  { name: 'Los Angeles', coordinates: [-118.2437, 34.0522], country: 'United States' },
  { name: 'London', coordinates: [-0.1278, 51.5074], country: 'United Kingdom' },
  { name: 'Paris', coordinates: [2.3522, 48.8566], country: 'France' },
  { name: 'Beijing', coordinates: [116.4074, 39.9042], country: 'China' },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895], country: 'Japan' },
  { name: 'Sydney', coordinates: [151.2093, -33.8688], country: 'Australia' },
  { name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], country: 'Brazil' },
  { name: 'Cairo', coordinates: [31.2357, 30.0444], country: 'Egypt' },
  { name: 'Mumbai', coordinates: [72.8777, 19.0760], country: 'India' },
  { name: 'Moscow', coordinates: [37.6173, 55.7558], country: 'Russia' },
  { name: 'Cape Town', coordinates: [18.4241, -33.9249], country: 'South Africa' },
];

// AQI color scale
const colorScale = scaleLinear()
  .domain([0, 50, 100, 150, 200, 300])
  .range([
    '#009966', // Good
    '#FFDE33', // Moderate
    '#FF9933', // Unhealthy for sensitive groups
    '#CC0033', // Unhealthy
    '#660099', // Very unhealthy
    '#7E0023', // Hazardous
  ]);

// Weather condition icons mapping (using emoji as placeholders)
const weatherIcons = {
  clear: '☀️',
  cloudy: '☁️',
  partlyCloudy: '⛅',
  rain: '🌧️',
  snow: '❄️',
  fog: '🌫️',
  thunderstorm: '⛈️',
};

// Convert weather code to weather type
const getWeatherType = (code) => {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  return 'clear'; // default
};

// Helper function to get AQI level description
const getAqiLevel = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const InteractiveWorldMap = ({ onRegionClick }) => {
  const dispatch = useDispatch();
  const openAQLatest = useSelector((state) => state.weatherReducer.openAQLatest);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCity, setActiveCity] = useState(null);
  const [cityWeatherData, setCityWeatherData] = useState({});
  const [displayMode, setDisplayMode] = useState('airQuality'); // 'airQuality', 'weather', 'combined'
  const [selectedAqiRanges, setSelectedAqiRanges] = useState([]); // e.g., ['good', 'moderate']
  const [selectedWeatherTypes, setSelectedWeatherTypes] = useState([]); // e.g., ['clear', 'rain']
  const [legendCollapsed, setLegendCollapsed] = useState(false);

  // AQI ranges for filtering
  const aqiRanges = [
    {
      label: 'Good (0-50)', min: 0, max: 50, color: '#009966', key: 'good',
    },
    {
      label: 'Moderate (51-100)', min: 51, max: 100, color: '#FFDE33', key: 'moderate',
    },
    {
      label: 'Unhealthy for sensitive groups (101-150)', min: 101, max: 150, color: '#FF9933', key: 'unhealthySensitive',
    },
    {
      label: 'Unhealthy (151-200)', min: 151, max: 200, color: '#CC0033', key: 'unhealthy',
    },
    {
      label: 'Very unhealthy (201-300)', min: 201, max: 300, color: '#660099', key: 'veryUnhealthy',
    },
    {
      label: 'Hazardous (300+)', min: 301, max: 1000, color: '#7E0023', key: 'hazardous',
    },
  ];

  // Helper to get AQI range key
  const getAqiRangeKey = (aqi) => {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthySensitive';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'veryUnhealthy';
    return 'hazardous';
  };

  // Toggle AQI filter
  const toggleAqiRange = (key) => {
    setSelectedAqiRanges((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  // Toggle weather filter
  const toggleWeatherType = (type) => {
    setSelectedWeatherTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  // Helper to get OpenAQ AQI for a city
  const getOpenAQAQI = (cityName) => {
    if (openAQLatest && openAQLatest.results) {
      const cityResult = openAQLatest.results.find((r) => r.city === cityName);
      if (cityResult && cityResult.measurements && cityResult.measurements.length > 0) {
        // Use PM2.5 or fallback to first measurement
        const pm25 = cityResult.measurements.find((m) => m.parameter === 'pm25');
        return pm25 ? Math.round(pm25.value) : Math.round(cityResult.measurements[0].value);
      }
    }
    return null;
  };

  // Get mock or real AQI value for city
  const getCityAQI = (cityName) => {
    const openaqAqi = getOpenAQAQI(cityName);
    if (openaqAqi !== null && !Number.isNaN(openaqAqi)) return openaqAqi;

    // If we have real data, use it
    if (cityWeatherData[cityName]
        && cityWeatherData[cityName].airQuality
        && cityWeatherData[cityName].airQuality.hourly
        && cityWeatherData[cityName].airQuality.hourly.pm2_5) {
      const latestIndex = cityWeatherData[cityName].airQuality.hourly.time.length - 1;
      const pm25 = cityWeatherData[cityName].airQuality.hourly.pm2_5[latestIndex];

      // Convert PM2.5 to AQI (simplified formula)
      if (pm25 <= 12) return 25;
      if (pm25 <= 35.4) return 75;
      if (pm25 <= 55.4) return 125;
      if (pm25 <= 150.4) return 175;
      if (pm25 <= 250.4) return 250;
      return 350;
    }

    // Use mock data as fallback
    const mockValues = {
      'New York': 45,
      'Los Angeles': 72,
      London: 38,
      Paris: 42,
      Beijing: 112,
      Tokyo: 56,
      Sydney: 28,
      'Rio de Janeiro': 63,
      Cairo: 95,
      Mumbai: 134,
      Moscow: 51,
      'Cape Town': 47,
    };

    return mockValues[cityName] || Math.floor(Math.random() * 200);
  };

  // Update getCityWeatherIcon to optionally return type
  const getCityWeatherIcon = (cityName, returnType = false) => {
    if (cityWeatherData[cityName]
        && cityWeatherData[cityName].weather
        && cityWeatherData[cityName].weather.current_weather) {
      const weatherCode = cityWeatherData[cityName].weather.current_weather.weathercode;
      const weatherType = getWeatherType(weatherCode);
      return returnType ? weatherType : weatherIcons[weatherType];
    }
    return returnType ? 'clear' : weatherIcons.clear;
  };

  // Filtered cities based on legend selection
  const filteredCities = majorCities.filter((city) => {
    const aqi = getCityAQI(city.name);
    const weatherType = getCityWeatherIcon(city.name, true); // pass true to get type
    const aqiMatch = selectedAqiRanges.length === 0 || selectedAqiRanges.includes(getAqiRangeKey(aqi));
    const weatherMatch = selectedWeatherTypes.length === 0 || selectedWeatherTypes.includes(weatherType);
    return aqiMatch && weatherMatch;
  });

  // Animate legend collapse/expand
  const legendSpring = useSpring({
    height: legendCollapsed ? 0 : 'auto',
    opacity: legendCollapsed ? 0 : 1,
    overflow: 'hidden',
    config: { tension: 250, friction: 30 },
  });

  // Animate tooltip
  const tooltipSpring = useSpring({
    opacity: showTooltip ? 1 : 0,
    transform: showTooltip ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 20 },
  });

  // Animate marker selection (scale up selected marker)
  const getMarkerSpring = (cityName) => useSpring({
    transform: activeCity === cityName ? 'scale(1.3)' : 'scale(1)',
    config: { tension: 300, friction: 20 },
  });

  useEffect(() => {
    const handleResize = () => {
      // No-op: removed setPosition
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Fetch weather data for all major cities
    majorCities.forEach((city) => {
      dispatch(fetchCombinedWeatherAndAirQuality(city.coordinates[1], city.coordinates[0]))
        .then((data) => {
          setCityWeatherData((prevData) => ({
            ...prevData,
            [city.name]: data,
          }));
        })
        .catch((error) => {
          // Only log in development environment
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(`Error fetching data for ${city.name}:`, error);
          }
        });
    });

    // Fetch OpenAQ data for all major cities every 10 minutes
    majorCities.forEach((city) => {
      dispatch(getOpenAQLatest({ city: city.name }));
    });
    const interval = setInterval(() => {
      majorCities.forEach((city) => {
        dispatch(getOpenAQLatest({ city: city.name }));
      });
    }, 600000); // 10 minutes

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [dispatch]);

  const handleMoveEnd = () => {
    // No-op: removed setPosition
  };

  const handleRegionClick = (geo) => {
    if (onRegionClick) {
      onRegionClick(geo.properties.name);
    }
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (geo) => {
    setTooltipContent(geo.properties.name);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleCityClick = (city) => {
    setActiveCity(city.name === activeCity ? null : city.name);
  };

  // Show loading or error for OpenAQ
  if (openAQLatest && openAQLatest.results && openAQLatest.results.length === 0) {
    return <div className="interactive-map-container">No OpenAQ data available.</div>;
  }
  if (openAQLatest && openAQLatest.error) {
    return (
      <div className="interactive-map-container">
        Error loading OpenAQ data:
        <br />
        {openAQLatest.error}
      </div>
    );
  }

  return (
    <div className="interactive-map-container" onMouseMove={handleMouseMove}>
      {/* Display mode toggles */}
      <div className="map-display-options">
        <button
          type="button"
          className={`display-option ${displayMode === 'airQuality' ? 'active' : ''}`}
          onClick={() => setDisplayMode('airQuality')}
        >
          Air Quality
        </button>
        <button
          type="button"
          className={`display-option ${displayMode === 'weather' ? 'active' : ''}`}
          onClick={() => setDisplayMode('weather')}
        >
          Weather
        </button>
        <button
          type="button"
          className={`display-option ${displayMode === 'combined' ? 'active' : ''}`}
          onClick={() => setDisplayMode('combined')}
        >
          Combined View
        </button>
      </div>

      {showTooltip && (
        <animated.div
          className="map-tooltip"
          style={{
            ...tooltipSpring,
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        >
          {tooltipContent}
        </animated.div>
      )}

      <ComposableMap
        projectionConfig={{
          scale: 147,
        }}
        className="world-map-svg"
      >
        <ZoomableGroup
          zoom={1}
          center={[0, 0]}
          onMoveEnd={handleMoveEnd}
          maxZoom={1}
          minZoom={1}
          disableZoom
          disablePanning
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#B0BEC5" // Changed from #EAEAEC to a more visible blue-gray
                stroke="#607D8B" // Changed from #D6D6DA to a more visible dark gray-blue
                onClick={() => handleRegionClick(geo)}
                onMouseEnter={() => handleMouseEnter(geo)}
                onMouseLeave={handleMouseLeave}
                style={{
                  default: {
                    fill: '#B0BEC5',
                    outline: 'none',
                    stroke: '#607D8B',
                    strokeWidth: 0.7,
                  },
                  hover: {
                    fill: '#009688',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 250ms',
                  },
                  pressed: {
                    fill: '#006C60',
                    outline: 'none',
                  },
                }}
              />
            ))}
          </Geographies>

          {/* Air Quality & Weather Markers */}
          {filteredCities.map((city) => {
            const aqi = getCityAQI(city.name);
            const weatherIcon = getCityWeatherIcon(city.name);
            const markerSpring = getMarkerSpring(city.name);
            return (
              <React.Fragment key={`city-${city.name}`}>
                {/* Show different markers based on display mode */}
                {(displayMode === 'airQuality' || displayMode === 'combined') && (
                  <Marker coordinates={city.coordinates} onClick={() => handleCityClick(city)}>
                    <animated.g style={markerSpring}>
                      <circle
                        r={Math.max(aqi / 15 + 5, 8)} // Ensure minimum radius of 8
                        fill={colorScale(aqi) || '#1976d2'}
                        stroke="#FFFFFF"
                        strokeWidth={1}
                        opacity={0.9}
                        className="city-marker"
                      />
                    </animated.g>
                  </Marker>
                )}
                {(displayMode === 'weather' || displayMode === 'combined') && (
                  <Marker
                    coordinates={[
                      city.coordinates[0] + (displayMode === 'combined' ? 3 : 0),
                      city.coordinates[1] + (displayMode === 'combined' ? 3 : 0),
                    ]}
                    onClick={() => handleCityClick(city)}
                  >
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: displayMode === 'combined' ? '14px' : '18px' }}
                      className="weather-icon-marker"
                    >
                      {weatherIcon}
                    </text>
                  </Marker>
                )}
                {/* City name for selected city */}
                {activeCity === city.name && (
                  <Annotation
                    subject={city.coordinates}
                    dx={-40}
                    dy={-40}
                    connectorProps={{
                      stroke: '#009688',
                      strokeWidth: 2,
                      strokeLinecap: 'round',
                    }}
                  >
                    <g>
                      <rect
                        x={4}
                        y={-30}
                        width={120}
                        height={50}
                        rx={5}
                        fill="rgba(255,255,255,0.9)"
                        stroke="#009688"
                      />
                      <text
                        x={12}
                        y={-15}
                        fill="#000"
                        textAnchor="start"
                        alignmentBaseline="middle"
                        className="annotation-text city-name"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {city.name}
                      </text>
                      <text
                        x={12}
                        y={0}
                        fill="#000"
                        textAnchor="start"
                        alignmentBaseline="middle"
                        className="annotation-text"
                        fontSize={10}
                      >
                        AQI:
                        {' '}
                        {aqi}
                        {' '}
                        (
                        {getAqiLevel(aqi)}
                        )
                      </text>
                      <text
                        x={12}
                        y={15}
                        fill="#000"
                        textAnchor="start"
                        alignmentBaseline="middle"
                        className="annotation-text"
                        fontSize={10}
                      >
                        {weatherIcon}
                        {' '}
                        {
                          cityWeatherData[city.name]?.weather?.current_weather?.temperature
                            ? `${cityWeatherData[city.name].weather.current_weather.temperature}°C`
                            : ''
                        }
                      </text>
                    </g>
                  </Annotation>
                )}
              </React.Fragment>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <animated.div className="map-legend" style={legendSpring}>
        <button className="legend-collapse-btn" type="button" onClick={() => setLegendCollapsed((c) => !c)}>
          {legendCollapsed ? 'Show Legend' : 'Hide Legend'}
        </button>
        {!legendCollapsed && (
          <>
            <h4>Air Quality Index (AQI)</h4>
            <div className="legend-items">
              {aqiRanges.map((range) => (
                <button
                  key={range.key}
                  className={`legend-item legend-btn${selectedAqiRanges.includes(range.key) ? ' selected' : ''}`}
                  onClick={() => toggleAqiRange(range.key)}
                  type="button"
                >
                  <span
                    className="legend-color-swatch"
                    style={{ backgroundColor: range.color }}
                  />
                  <span>{range.label}</span>
                </button>
              ))}
            </div>
            <div className="legend-divider" />
            <h4>Weather Conditions</h4>
            <div className="legend-items weather-legend">
              {Object.entries(weatherIcons).map(([type, icon]) => (
                <button
                  key={`weather-type-${type}`}
                  className={`legend-item legend-btn${selectedWeatherTypes.includes(type) ? ' selected' : ''}`}
                  style={{ margin: '2px', border: '1px solid #888' }}
                  onClick={() => toggleWeatherType(type)}
                  type="button"
                >
                  <span className="weather-icon">{icon}</span>
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </animated.div>
    </div>
  );
};

InteractiveWorldMap.propTypes = {
  onRegionClick: PropTypes.func,
};

InteractiveWorldMap.defaultProps = {
  onRegionClick: null,
};

export default InteractiveWorldMap;
