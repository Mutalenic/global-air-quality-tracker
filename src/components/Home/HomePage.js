import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import OptimizedImage from '../utils/OptimizedImage';

import AfricaImg from '../Maps/Africa.png';
import AmericaImg from '../Maps/America.png';
import AsiaImg from '../Maps/Asia.png';
import EuropeImg from '../Maps/Europe.png';
import OceaniaImg from '../Maps/Oceania.png';
import AntarcticaImg from '../Maps/Antarctica.png';

const regions = [
  { name: 'Africa', img: AfricaImg, path: '/countries?region=Africa' },
  { name: 'America', img: AmericaImg, path: '/countries?region=America' },
  { name: 'Asia', img: AsiaImg, path: '/countries?region=Asia' },
  { name: 'Europe', img: EuropeImg, path: '/countries?region=Europe' },
  { name: 'Oceania', img: OceaniaImg, path: '/countries?region=Oceania' },
  { name: 'Antarctica', img: AntarcticaImg, path: '/countries?region=Antarctica' },
];

export default function HomePage() {
  return (
    <Box className="home-page">
      <div className="hero-section">
        <span className="logo">🌍 Air Quality Tracker</span>
        <button className="menu-btn" aria-label="Menu" type="button"><MenuIcon /></button>
      </div>
      <Typography variant="h4" align="center" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
        Explore Global Air Quality by Region
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Select a world region to view air quality data and trends
      </Typography>
      <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 900, margin: '0 auto' }}>
        {regions.map((region) => (
          <Grid item xs={12} sm={6} md={4} key={region.name}>
            <a href={region.path} style={{ textDecoration: 'none' }}>
              <Paper
                elevation={4}
                sx={{
                  p: 2, borderRadius: 3, textAlign: 'center', transition: '0.2s', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' },
                }}
              >
                <OptimizedImage src={region.img} alt={region.name} width={120} height={120} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>{region.name}</Typography>
              </Paper>
            </a>
          </Grid>
        ))}
      </Grid>
      <BottomNavigation showLabels className="bottom-nav">
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Map" icon={<MapIcon />} />
        <BottomNavigationAction label="Explore" icon={<PublicIcon />} />
        <BottomNavigationAction label="News" icon={<ArticleIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
}
