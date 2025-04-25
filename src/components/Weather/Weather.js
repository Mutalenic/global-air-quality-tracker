import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Weather.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faCloud,
  faCloudRain,
  faSnowflake,
  faCloudBolt,
  faSmog,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';

const Weather = ({ lat, lng, city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API key should be stored in an environment variable in production
  const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (lat && lng) {
      fetchWeather();
    }
  }, [lat, lng]);

  const getWeatherIcon = (weatherCode) => {
    // Map weather codes to Font Awesome icons
    const weatherMap = {
      '01': faSun, // clear sky
      '02': faCloud, // few clouds
      '03': faCloud, // scattered clouds
      '04': faCloud, // broken clouds
      '09': faCloudRain, // shower rain
      10: faCloudRain, // rain
      11: faCloudBolt, // thunderstorm
      13: faSnowflake, // snow
      50: faSmog, // mist
    };

    const code = weatherCode.substring(0, 2);
    return weatherMap[code] || faQuestion;
  };

  if (loading) {
    return <div className="weather-loading">Loading weather data...</div>;
  }

  if (error) {
    return (
      <div className="weather-error">
        Unable to load weather data:
        {' '}
        {error}
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h3>
          Weather for
          {' '}
          {city || weather.name}
        </h3>
      </div>
      <div className="weather-content">
        <div className="weather-icon">
          <FontAwesomeIcon
            icon={getWeatherIcon(weather.weather[0].icon)}
            size="3x"
          />
          <p>{weather.weather[0].description}</p>
        </div>
        <div className="weather-details">
          <div className="weather-temp">
            <p className="temp-value">
              {Math.round(weather.main.temp)}
              °C
            </p>
            <p className="temp-feels-like">
              Feels like:
              {' '}
              {Math.round(weather.main.feels_like)}
              °C
            </p>
          </div>
          <div className="weather-info">
            <p>
              Humidity:
              {' '}
              {weather.main.humidity}
              %
            </p>
            <p>
              Wind:
              {' '}
              {Math.round(weather.wind.speed)}
              {' '}
              m/s
            </p>
            <p>
              Pressure:
              {' '}
              {weather.main.pressure}
              {' '}
              hPa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Weather.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  city: PropTypes.string,
};

Weather.defaultProps = {
  city: '',
};

export default Weather;
