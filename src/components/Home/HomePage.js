import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Container, Paper, Button, TextField,
  InputAdornment, Chip, Grid, Card, Divider, Alert, Fab, BottomNavigation, BottomNavigationAction,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';

const forecastData = [
  { time: '12:00', emoji: '🌤️', aqi: 65 },
  { time: '15:00', emoji: '🌧️', aqi: 70 },
  // ...more
];

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6">AirQuality</Typography>
          <Box flexGrow={1} />
          <IconButton><MenuIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">Current Location</Typography>
          <Button size="small" startIcon={<LocationOnIcon />}>Use My Location</Button>
        </Box>

        <TextField
          fullWidth
          label="Search City or Country"
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box mt={4} textAlign="center">
          <Chip label="Moderate" color="warning" />
          <Typography variant="h3" fontWeight="bold" mt={1}>AQI: 72</Typography>
          <Typography variant="subtitle1" color="text.secondary">Lusaka, Zambia</Typography>
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography color="success.main" fontWeight="bold">PM2.5</Typography>
              <Typography variant="h6">35 µg/m³</Typography>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography color="error.main" fontWeight="bold">PM10</Typography>
              <Typography variant="h6">50 µg/m³</Typography>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" fontWeight="bold" mt={2}>
          Health Advice
        </Typography>
        <Alert severity="info" sx={{ mt: 1 }}>
          Reduce prolonged outdoor exertion if you are unusually sensitive.
        </Alert>

        <Typography variant="h6" mt={3} gutterBottom>Forecast</Typography>
        <Box display="flex" gap={1} overflow="auto">
          {forecastData.map((day) => (
            <Card key={day.time} sx={{ minWidth: 80, p: 1, textAlign: 'center' }}>
              <Typography variant="caption">{day.time}</Typography>
              <Typography>{day.emoji}</Typography>
              <Typography variant="body2">{day.aqi}</Typography>
            </Card>
          ))}
        </Box>

        <Fab color="primary" aria-label="menu" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <AddIcon />
        </Fab>
      </Paper>

      <BottomNavigation showLabels>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Map" icon={<MapIcon />} />
        <BottomNavigationAction label="Explore" icon={<PublicIcon />} />
        <BottomNavigationAction label="News" icon={<ArticleIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Container>
  );
}
