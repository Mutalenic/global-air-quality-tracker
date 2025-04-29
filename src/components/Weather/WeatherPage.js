import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Alert, Grid,
} from '@mui/material';
import Navbar from '../Navbar/Navbar';
import Weather from './Weather';

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
    <Box className="weather-page">
      <Navbar />
      <Box className="weather-page-content">
        <Paper elevation={3} sx={{ p: 3, mb: 4 }} aria-label="Weather and air quality search">
          <Typography variant="h4" gutterBottom>Weather & Air Quality</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Explore how weather conditions affect air quality around the world
          </Typography>
          <Box component="form" onSubmit={handleSearch} display="flex" gap={2} my={2}>
            <TextField
              placeholder="Search"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              disabled={isSearching}
              label="Search for a location"
              variant="outlined"
              sx={{ flexGrow: 1, minWidth: 220 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSearching}
              sx={{ minWidth: 120 }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }} aria-label="Weather results">
          <Weather latitude={location.latitude} longitude={location.longitude} />
        </Paper>
        <Paper elevation={1} sx={{ p: 3, mb: 4 }} aria-label="Weather and air quality info">
          <Typography variant="h5" gutterBottom>Understanding Weather & Air Quality</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">Temperature</Typography>
                <Typography variant="body2">
                  Higher temperatures accelerate reactions, increasing ground-level ozone formation.
                  Cold temperatures can increase visible pollutants from vehicle exhaust.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">Wind</Typography>
                <Typography variant="body2">
                  Strong winds disperse pollutants, improving air quality. Calm conditions
                  trap pollutants, leading to stagnant air and poor quality.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">Precipitation</Typography>
                <Typography variant="body2">
                  Rain and snow wash away particulate matter and water-soluble pollutants,
                  generally improving air quality during and after precipitation events.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6">Humidity</Typography>
                <Typography variant="body2">
                  High humidity can affect pollutant formation and collection, while high-pressure
                  systems can create stagnant air conditions, trapping pollutants.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default WeatherPage;
