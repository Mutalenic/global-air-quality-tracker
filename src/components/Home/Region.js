import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  SpeedDial,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import CloseIcon from '@mui/icons-material/Close';
import LayersIcon from '@mui/icons-material/Layers';
import { fetchAllCountries } from '../../redux/apiFunctions';
import InteractiveWorldMap from '../Maps/InteractiveMap/InteractiveWorldMap';
import Header from '../Navbar/Navbar';

const Regions = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const navigate = useNavigate();

  const regionList = [
    { region: 'Africa', country: 59 },
    { region: 'Americas', country: 56 },
    { region: 'Europe', country: 53 },
    { region: 'Asia', country: 50 },
    { region: 'Oceania', country: 27 },
    { region: 'Antarctic', country: 5 },
  ];

  useEffect(() => {
    const loadCountries = async () => {
      const options = await fetchAllCountries();
      setCountryOptions(options);
    };
    loadCountries();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedCountry) {
      navigate(`/countries?search=${encodeURIComponent(selectedCountry.label)}&region=${selectedRegion || 'all'}`);
    }
  };

  const handleRegionClick = (regionName) => {
    const regionMap = {
      'United States of America': 'Americas',
      Canada: 'Americas',
      Brazil: 'Americas',
      Mexico: 'Americas',
      'United Kingdom': 'Europe',
      France: 'Europe',
      Germany: 'Europe',
      Italy: 'Europe',
      Russia: 'Europe',
      China: 'Asia',
      India: 'Asia',
      Japan: 'Asia',
      Australia: 'Oceania',
      'New Zealand': 'Oceania',
      'South Africa': 'Africa',
      Egypt: 'Africa',
      Nigeria: 'Africa',
      Kenya: 'Africa',
      Antarctica: 'Antarctic',
    };
    const mappedRegion = regionMap[regionName] || '';
    if (mappedRegion) {
      navigate(`/countries?region=${mappedRegion}`);
    }
  };

  const handleRegionLinkClick = (regionName) => {
    navigate(`/countries?region=${regionName}`);
    setIsRegionMenuOpen(false);
  };

  const filteredCountryOptions = selectedRegion
    ? countryOptions.filter((option) => option.region === selectedRegion)
    : countryOptions;

  return (
    <Box className="home-container">
      <Header id="/" />
      <Box className="hero-section">
        <Box className="map-header-container">
          <Typography variant="h3" fontWeight="bold" gutterBottom>Breathe Easier, Know Your Air</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Explore real-time air quality and weather conditions across the globe.
          </Typography>
        </Box>
        <Box className="world-container" sx={{ my: 3 }}>
          <InteractiveWorldMap onRegionClick={handleRegionClick} />
        </Box>
        <Box className="benefits-section" sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>Why Track Air Quality?</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <PublicIcon color="primary" fontSize="large" />
                  <Typography variant="h6">Global Coverage</Typography>
                  <Typography variant="body2">Air quality data for countries across all regions</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <LayersIcon color="secondary" fontSize="large" />
                  <Typography variant="h6">Location-Based</Typography>
                  <Typography variant="body2">Find data specific to your region or country</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <MenuIcon color="action" fontSize="large" />
                  <Typography variant="h6">Visual Analytics</Typography>
                  <Typography variant="body2">Easy-to-understand pollution metrics</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <CloseIcon color="error" fontSize="large" />
                  <Typography variant="h6">Health Insights</Typography>
                  <Typography variant="body2">Learn how air quality affects your wellbeing</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Paper sx={{ p: 3, my: 4 }}>
        <Typography variant="h5" gutterBottom>Find Air Quality Data for a Specific Country</Typography>
        <Box component="form" onSubmit={handleSearch} display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <Autocomplete
            options={filteredCountryOptions}
            getOptionLabel={(option) => option.label || ''}
            value={selectedCountry}
            onChange={(_, value) => setSelectedCountry(value)}
            renderInput={() => (
              <TextField label="Search for a country..." variant="outlined" sx={{ minWidth: 220 }} />
            )}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            sx={{ flexGrow: 2 }}
            clearOnEscape
          />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={selectedRegion}
              label="Region"
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCountry(null);
              }}
            >
              <MenuItem value="">All Regions</MenuItem>
              {regionList.map((region) => (
                <MenuItem key={region.region} value={region.region}>{region.region}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" disabled={!selectedCountry} sx={{ minWidth: 120 }}>
            Search
          </Button>
        </Box>
      </Paper>
      <SpeedDial
        ariaLabel="Open regions menu"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<LayersIcon />}
        onClick={() => setIsRegionMenuOpen(true)}
      >
        {/* No actions, just opens dialog */}
      </SpeedDial>
      <Dialog open={isRegionMenuOpen} onClose={() => setIsRegionMenuOpen(false)}>
        <DialogTitle>
          Explore by Region
          <IconButton
            aria-label="close"
            onClick={() => setIsRegionMenuOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {regionList.map((item) => (
              <Button
                key={item.region}
                variant="outlined"
                onClick={() => handleRegionLinkClick(item.region)}
                fullWidth
              >
                {item.region}
              </Button>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Regions;
