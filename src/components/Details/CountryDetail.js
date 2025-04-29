import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './CountryDetail.css';
import {
  Card, Box, IconButton, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Grid, SpeedDial, SpeedDialAction,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MapIcon from '@mui/icons-material/Map';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PollutionChart from './PollutionChart';

const getAqiClass = (aqi) => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
};

const getHealthAdvisory = (aqi) => {
  if (aqi <= 50) return 'Air quality is good.';
  if (aqi <= 100) return 'Air quality is moderate.';
  if (aqi <= 150) return 'Unhealthy for sensitive groups.';
  if (aqi <= 200) return 'Unhealthy: Reduce prolonged outdoor exertion.';
  if (aqi <= 300) return 'Very unhealthy: Avoid outdoor activity.';
  return 'Hazardous: Remain indoors.';
};

const CountryDetail = () => {
  const { country } = useParams();
  const { pollutionData } = useSelector((state) => state.pollutionReducer);
  const [cities, setCities] = useState([]);
  const [nationalAQI, setNationalAQI] = useState(0);
  const [trendData, setTrendData] = useState({});
  const [bestCity, setBestCity] = useState(null);
  const [worstCity, setWorstCity] = useState(null);

  useEffect(() => {
    // Fetch pollution data for all major cities in the country
    // For demo, assume pollutionData is an array of city objects with {name, aqi, mainPollutant, mainValue, trendData}
    // In real app, dispatch(getPollutionData(...)) for each city or for the country
    if (pollutionData && Array.isArray(pollutionData)) {
      const countryCities = pollutionData.filter((c) => c.country === country);
      setCities(
        countryCities.map((city) => ({
          ...city,
          aqiClass: getAqiClass(city.aqi),
          trendData: city.trendData || city, // fallback to city data
        })),
      );
      // National AQI as average
      const avgAQI = countryCities.length
        ? Math.round(countryCities.reduce((sum, c) => sum + c.aqi, 0) / countryCities.length)
        : 0;
      setNationalAQI(avgAQI);
      setTrendData({ ...countryCities[0] }); // Use first city as trend sample for now
      // Best/worst
      setBestCity(countryCities.reduce((best, c) => (!best || c.aqi < best.aqi ? c : best), null));
      setWorstCity(countryCities.reduce((worst, c) => (!worst || c.aqi > worst.aqi ? c : worst), null));
    }
  }, [pollutionData, country]);

  return (
    <Card sx={{ p: 3, m: 2 }}>
      <Box display="flex" alignItems="center">
        <IconButton><ArrowBackIcon /></IconButton>
        <img src="/flags/za.png" alt="Zambia" style={{ width: 30, marginLeft: 8 }} />
        <Typography variant="h6" ml={1}>Zambia</Typography>
      </Box>
      <Box textAlign="center" my={2}>
        <Typography variant="h4">
          AQI:
          {nationalAQI}
        </Typography>
        <Chip label={getHealthAdvisory(nationalAQI)} color="warning" sx={{ mt: 1 }} />
      </Box>
      <Box my={2}>
        <Typography variant="h6" mb={1}>Best & Worst Cities</Typography>
        <Grid container spacing={2} justifyContent="center">
          {bestCity && (
            <Grid item>
              <Chip label={`Best: ${bestCity.name} (AQI ${bestCity.aqi})`} color="success" />
            </Grid>
          )}
          {worstCity && (
            <Grid item>
              <Chip label={`Worst: ${worstCity.name} (AQI ${worstCity.aqi})`} color="error" />
            </Grid>
          )}
        </Grid>
      </Box>
      <Box my={2}>
        <Typography variant="h6" mb={1}>Major Cities</Typography>
        <List>
          {cities.map((city) => (
            <ListItem button key={city.name} divider>
              <ListItemText
                primary={city.name}
                secondary={`AQI: ${city.aqi} | ${city.mainPollutant}: ${city.mainValue} µg/m³`}
              />
              <ListItemIcon>
                <ArrowForwardIosIcon fontSize="small" />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box my={2}>
        <Typography variant="h6" mb={1}>7-Day AQI Trend</Typography>
        <PollutionChart pollutionData={trendData} />
      </Box>
      <SpeedDial
        ariaLabel="Country actions"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<ShowChartIcon />}
      >
        <SpeedDialAction icon={<MapIcon />} tooltipTitle="Go to Map" />
        <SpeedDialAction icon={<ContentCopyIcon />} tooltipTitle="Copy Summary" />
        <SpeedDialAction icon={<ShowChartIcon />} tooltipTitle="View Trends" />
      </SpeedDial>
    </Card>
  );
};

export default CountryDetail;
