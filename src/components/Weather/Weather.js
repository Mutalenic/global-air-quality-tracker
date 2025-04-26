import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCombinedWeatherAndAirQuality } from '../../redux/Actions/Weather';
import './Weather.css';

/**
 * Weather component that displays current weather conditions
 * and explains how they affect air quality
 */
const Weather = ({ latitude, longitude }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Select the needed data from Redux store
  const { weatherData, airQualityForecast, analysis } = useSelector(
    (state) => state.weatherReducer || {},
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!latitude || !longitude) return;

      try {
        setIsLoading(true);
        setError(null);
        await dispatch(fetchCombinedWeatherAndAirQuality(latitude, longitude));
      } catch (err) {
        setError(err.message || 'Failed to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, latitude, longitude]);

  // Get current weather information
  const getCurrentWeather = () => {
    if (!weatherData || !weatherData.current_weather) {
      return null;
    }

    const { temperature, windspeed, weathercode } = weatherData.current_weather;

    // Convert weather code to description
    const weatherCodes = {
      0: { desc: 'Clear sky', icon: '☀️' },
      1: { desc: 'Mainly clear', icon: '🌤️' },
      2: { desc: 'Partly cloudy', icon: '⛅' },
      3: { desc: 'Overcast', icon: '☁️' },
      45: { desc: 'Fog', icon: '🌫️' },
      48: { desc: 'Depositing rime fog', icon: '🌫️❄️' },
      51: { desc: 'Light drizzle', icon: '🌦️' },
      53: { desc: 'Moderate drizzle', icon: '🌧️' },
      55: { desc: 'Dense drizzle', icon: '🌧️' },
      61: { desc: 'Slight rain', icon: '🌦️' },
      63: { desc: 'Moderate rain', icon: '🌧️' },
      65: { desc: 'Heavy rain', icon: '🌧️' },
      71: { desc: 'Slight snow fall', icon: '🌨️' },
      73: { desc: 'Moderate snow fall', icon: '❄️' },
      75: { desc: 'Heavy snow fall', icon: '❄️' },
      80: { desc: 'Slight rain showers', icon: '🌦️' },
      81: { desc: 'Moderate rain showers', icon: '🌧️' },
      82: { desc: 'Violent rain showers', icon: '⛈️' },
      95: { desc: 'Thunderstorm', icon: '⛈️' },
      96: { desc: 'Thunderstorm with slight hail', icon: '⛈️🌨️' },
      99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️🌨️' },
    };

    const weather = weatherCodes[weathercode] || { desc: 'Unknown', icon: '❓' };

    return {
      temperature: Math.round(temperature),
      windspeed: Math.round(windspeed),
      description: weather.desc,
      icon: weather.icon,
    };
  };

  // Get the current air quality data
  const getCurrentAirQuality = () => {
    if (!airQualityForecast || !airQualityForecast.hourly) {
      return null;
    }

    // Get the most recent hour's data
    const latestHourIndex = airQualityForecast.hourly.time.length - 1;
    const pm25 = airQualityForecast.hourly.pm2_5?.[latestHourIndex] || 0;
    const pm10 = airQualityForecast.hourly.pm10?.[latestHourIndex] || 0;

    // Calculate AQI (simplified version)
    let aqi;
    if (pm25 <= 12) {
      aqi = { level: 'Good', color: '#00e400', description: 'Air quality is satisfactory' };
    } else if (pm25 <= 35.4) {
      aqi = { level: 'Moderate', color: '#ffff00', description: 'Air quality is acceptable' };
    } else if (pm25 <= 55.4) {
      aqi = { level: 'Unhealthy for Sensitive Groups', color: '#ff7e00', description: 'Members of sensitive groups may experience health effects' };
    } else if (pm25 <= 150.4) {
      aqi = { level: 'Unhealthy', color: '#ff0000', description: 'Everyone may begin to experience health effects' };
    } else if (pm25 <= 250.4) {
      aqi = { level: 'Very Unhealthy', color: '#8f3f97', description: 'Health warnings of emergency conditions' };
    } else {
      aqi = { level: 'Hazardous', color: '#7e0023', description: 'Health alert: everyone may experience serious health effects' };
    }

    return {
      pm25,
      pm10,
      aqi,
    };
  };

  // Display loading state
  if (isLoading) {
    return <div className="weather-loading">Loading weather data...</div>;
  }

  // Display error state
  if (error) {
    return (
      <div className="weather-error">
        Error:
        {error}
      </div>
    );
  }

  const weather = getCurrentWeather();
  const airQuality = getCurrentAirQuality();

  // If no data is available, return message
  if (!weather || !airQuality) {
    return <div className="weather-no-data">No weather data available for this location.</div>;
  }

  return (
    <div className="weather-container">
      <div className="weather-section">
        <div className="weather-header">
          <h2>Current Weather</h2>
          <div className="weather-icon">{weather.icon}</div>
        </div>

        <div className="weather-details">
          <div className="weather-item">
            <span className="label">Temperature:</span>
            <span className="value">
              {weather.temperature}
              °C
            </span>
          </div>
          <div className="weather-item">
            <span className="label">Wind Speed:</span>
            <span className="value">
              {weather.windspeed}
              {' '}
              km/h
            </span>
          </div>
          <div className="weather-item">
            <span className="label">Conditions:</span>
            <span className="value">{weather.description}</span>
          </div>
        </div>
      </div>

      <div className="air-quality-section">
        <h2>Air Quality Impact</h2>
        <div
          className="aqi-indicator"
          style={{ backgroundColor: airQuality.aqi.color }}
        >
          {airQuality.aqi.level}
        </div>

        <div className="air-quality-details">
          <div className="air-quality-item">
            <span className="label">PM2.5:</span>
            <span className="value">
              {airQuality.pm25}
              {' '}
              µg/m³
            </span>
          </div>
          <div className="air-quality-item">
            <span className="label">PM10:</span>
            <span className="value">
              {airQuality.pm10}
              {' '}
              µg/m³
            </span>
          </div>
          <div className="air-quality-item description">
            {airQuality.aqi.description}
          </div>
        </div>
      </div>

      {analysis && analysis.effects && analysis.effects.length > 0 && (
        <div className="weather-impact-section">
          <h3>Weather Impact on Air Quality</h3>
          <ul className="weather-impact-list">
            {analysis.effects.map((effect, index) => (
              <li
                key={`effect-${index}`}
                className={`impact-item impact-${effect.impact}`}
              >
                <strong>
                  {effect.factor.charAt(0).toUpperCase() + effect.factor.slice(1)}
                  :
                </strong>
                {' '}
                {effect.description}
              </li>
            ))}
          </ul>

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="recommendations">
              <h4>Recommendations</h4>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={`rec-${index}`}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
