import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPollutionData } from '../../redux/Actions/Pollution';
import PollutionChart from './PollutionChart';
import './CountryDetail.css';
import {
  Card, Box, IconButton, Typography, List, ListItem, ListItemText, ListItemIcon
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const AQISummary = ({
  countryName, nationalAQI, trendData, healthAdvisory,
}) => (
  <section className="aqi-summary glass">
    <h2>
      National AQI for
      {countryName}
      :
      <span className="aqi-number">{nationalAQI}</span>
    </h2>
    <div className="trend-chart-placeholder">
      <PollutionChart pollutionData={trendData} />
    </div>
    <div className="health-advisory">
      💡
      {healthAdvisory}
    </div>
  </section>
);

const BestWorstCities = ({ bestCity, worstCity }) => (
  <section className="best-worst-cities">
    {bestCity && (
      <div className="best-city banner">
        ✅ Best:
        {' '}
        {bestCity.name}
        {' '}
        (AQI
        {' '}
        {bestCity.aqi}
        )
      </div>
    )}
    {worstCity && (
      <div className="worst-city banner">
        ❗ Worst:
        {' '}
        {worstCity.name}
        {' '}
        (AQI
        {' '}
        {worstCity.aqi}
        )
      </div>
    )}
  </section>
);

const CityList = ({ cities }) => (
  <section className="city-list">
    {cities.map((city) => (
      <div className="city-card" key={city.name}>
        <div className="city-header">
          <span className="city-name">{city.name}</span>
          <span className={`city-aqi ${city.aqiClass}`}>{city.aqi}</span>
        </div>
        <div className="city-pollutant">
          {city.mainPollutant}
          :
          {' '}
          {city.mainValue}
          {' '}
          µg/m³
        </div>
        <div className="city-sparkline">
          <PollutionChart pollutionData={city.trendData} small />
        </div>
      </div>
    ))}
  </section>
);

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

const CountryDetail = () => {
  const { country } = useParams();
  const dispatch = useDispatch();
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
      <Typography variant="h4" align="center" mt={2}>AQI: 72</Typography>
      <Typography align="center" color="text.secondary">Moderate</Typography>
      {/* <ChartComponent data={trendData} /> */}
      <List>
        {cities.map((city, index) => (
          <ListItem button key={index} divider>
            <ListItemText primary={city.name} secondary={`AQI: ${city.aqi}`} />
            <ListItemIcon>
              <ArrowForwardIosIcon fontSize="small" />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      <Box mt={2}>
        <Typography color="success.main">Best: Livingstone (AQI 43)</Typography>
        <Typography color="error.main">Worst: Kitwe (AQI 120)</Typography>
      </Box>
    </Card>
  );
};

export default CountryDetail;
