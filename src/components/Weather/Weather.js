import {
  Box, Paper, Typography, Grid, Chip, Alert, CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={120}>
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>Loading weather data...</Typography>
      </Box>
    );
  }

  // Display error state
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error:
        {error}
      </Alert>
    );
  }

  const weather = getCurrentWeather();
  const airQuality = getCurrentAirQuality();

  // If no data is available, return message
  if (!weather || !airQuality) {
    return <Alert severity="info" sx={{ my: 2 }}>No weather data available for this location.</Alert>;
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Current Weather</Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h2" sx={{ mr: 2 }}>{weather.icon}</Typography>
            <Box>
              <Typography variant="body1">{weather.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                Temperature:
                {weather.temperature}
                °C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wind Speed:
                {weather.windspeed}
                {' '}
                km/h
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Air Quality Impact</Typography>
          <Chip
            label={airQuality.aqi.level}
            sx={{
              bgcolor: airQuality.aqi.color, color: '#fff', fontWeight: 'bold', fontSize: 18, mb: 1,
            }}
          />
          <Typography variant="body2" color="text.secondary">{airQuality.aqi.description}</Typography>
          <Box mt={2}>
            <Typography variant="body2">
              PM2.5:
              <b>
                {airQuality.pm25}
                {' '}
                µg/m³
              </b>
            </Typography>
            <Typography variant="body2">
              PM10:
              <b>
                {airQuality.pm10}
                {' '}
                µg/m³
              </b>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {analysis && analysis.effects && analysis.effects.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Weather Impact on Air Quality</Typography>
          <ul style={{ paddingLeft: 20 }}>
            {analysis.effects.map((effect) => (
              <li
                key={`effect-${effect.factor}-${effect.impact}`}
                style={{ color: effect.impact === 'negative' ? '#d32f2f' : '#388e3c', marginBottom: 4 }}
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
            <Box mt={2}>
              <Typography variant="subtitle1">Recommendations</Typography>
              <ul style={{ paddingLeft: 20 }}>
                {analysis.recommendations.map((rec) => (
                  <li key={`rec-${rec.substring(0, 15).replace(/\s/g, '-')}`}>{rec}</li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

// Add PropTypes validation
Weather.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};

export default Weather;
