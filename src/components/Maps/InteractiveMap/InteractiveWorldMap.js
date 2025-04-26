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
import { fetchCombinedWeatherAndAirQuality } from '../../../redux/Actions/Weather';
import './InteractiveWorldMap.css';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

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

const InteractiveWorldMap = ({ onRegionClick }) => {
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCity, setActiveCity] = useState(null);
  const [cityWeatherData, setCityWeatherData] = useState({});
  const [displayMode, setDisplayMode] = useState('airQuality'); // 'airQuality', 'weather', 'combined'

  // Get weather data from Redux store
  const weatherData = useSelector((state) => state.weatherReducer?.weatherData);
  const airQualityData = useSelector((state) => state.weatherReducer?.airQualityForecast);

  useEffect(() => {
    const handleResize = () => {
      setPosition({ coordinates: [0, 0], zoom: window.innerWidth < 768 ? 0.8 : 1 });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Fetch weather data for all major cities
    majorCities.forEach(city => {
      dispatch(fetchCombinedWeatherAndAirQuality(city.coordinates[1], city.coordinates[0]))
        .then(data => {
          setCityWeatherData(prevData => ({
            ...prevData,
            [city.name]: data
          }));
        })
        .catch(error => console.error(`Error fetching data for ${city.name}:`, error));
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  const handleMoveEnd = (position) => {
    setPosition(position);
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

  // Get mock or real AQI value for city
  const getCityAQI = (cityName) => {
    // If we have real data, use it
    if (cityWeatherData[cityName] && 
        cityWeatherData[cityName].airQuality && 
        cityWeatherData[cityName].airQuality.hourly && 
        cityWeatherData[cityName].airQuality.hourly.pm2_5) {
      
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
      'London': 38,
      'Paris': 42,
      'Beijing': 112,
      'Tokyo': 56,
      'Sydney': 28,
      'Rio de Janeiro': 63,
      'Cairo': 95,
      'Mumbai': 134,
      'Moscow': 51,
      'Cape Town': 47,
    };
    
    return mockValues[cityName] || Math.floor(Math.random() * 200);
  };

  // Get weather icon for city
  const getCityWeatherIcon = (cityName) => {
    if (cityWeatherData[cityName] && 
        cityWeatherData[cityName].weather && 
        cityWeatherData[cityName].weather.current_weather) {
      
      const weatherCode = cityWeatherData[cityName].weather.current_weather.weathercode;
      const weatherType = getWeatherType(weatherCode);
      return weatherIcons[weatherType];
    }
    
    // Default icon if no data
    return weatherIcons.clear;
  };

  return (
    <div className="interactive-map-container" onMouseMove={handleMouseMove}>
      {/* Display mode toggles */}
      <div className="map-display-options">
        <button 
          className={`display-option ${displayMode === 'airQuality' ? 'active' : ''}`}
          onClick={() => setDisplayMode('airQuality')}
        >
          Air Quality
        </button>
        <button 
          className={`display-option ${displayMode === 'weather' ? 'active' : ''}`}
          onClick={() => setDisplayMode('weather')}
        >
          Weather
        </button>
        <button 
          className={`display-option ${displayMode === 'combined' ? 'active' : ''}`}
          onClick={() => setDisplayMode('combined')}
        >
          Combined View
        </button>
      </div>

      {showTooltip && (
        <div
          className="map-tooltip"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}
      
      <ComposableMap
        projectionConfig={{
          scale: 147,
        }}
        className="world-map-svg"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          maxZoom={5}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                onClick={() => handleRegionClick(geo)}
                onMouseEnter={() => handleMouseEnter(geo)}
                onMouseLeave={handleMouseLeave}
                style={{
                  default: {
                    fill: '#EAEAEC',
                    outline: 'none',
                    stroke: '#D6D6DA',
                    strokeWidth: 0.5,
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
          {majorCities.map((city, index) => {
            const aqi = getCityAQI(city.name);
            const weatherIcon = getCityWeatherIcon(city.name);
            
            return (
              <React.Fragment key={index}>
                {/* Show different markers based on display mode */}
                {(displayMode === 'airQuality' || displayMode === 'combined') && (
                  <Marker coordinates={city.coordinates} onClick={() => handleCityClick(city)}>
                    <circle
                      r={aqi / 15 + 5}
                      fill={colorScale(aqi)}
                      stroke="#FFFFFF"
                      strokeWidth={1}
                      opacity={0.8}
                      className="city-marker"
                    />
                  </Marker>
                )}
                
                {(displayMode === 'weather' || displayMode === 'combined') && (
                  <Marker 
                    coordinates={[
                      city.coordinates[0] + (displayMode === 'combined' ? 3 : 0), 
                      city.coordinates[1] + (displayMode === 'combined' ? 3 : 0)
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
                        AQI: {aqi} ({aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : 'Poor'})
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
                        {weatherIcon} {
                          cityWeatherData[city.name]?.weather?.current_weather?.temperature 
                          ? `${cityWeatherData[city.name].weather.current_weather.temperature}°C` 
                          : ''}
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
      <div className="map-legend">
        <h4>Air Quality Index (AQI)</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#009966' }} />
            <span>Good (0-50)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FFDE33' }} />
            <span>Moderate (51-100)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FF9933' }} />
            <span>Unhealthy for sensitive groups (101-150)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#CC0033' }} />
            <span>Unhealthy (151-200)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#660099' }} />
            <span>Very unhealthy (201-300)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#7E0023' }} />
            <span>Hazardous (300+)</span>
          </div>
        </div>
        
        <div className="legend-divider"></div>
        
        <h4>Weather Conditions</h4>
        <div className="legend-items weather-legend">
          {Object.entries(weatherIcons).map(([type, icon], index) => (
            <div className="legend-item" key={index}>
              <span className="weather-icon">{icon}</span>
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
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
