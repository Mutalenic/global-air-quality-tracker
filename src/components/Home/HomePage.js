import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
} from '@mui/material';
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
    <Box className="home-page" sx={{ minHeight: '100vh', width: '100vw', p: { xs: 0, md: 0 } }}>
      <div
        className="hero-section"
        style={{
          background: 'linear-gradient(120deg, #4caf50 60%, #2196f3 100%)',
          borderRadius: 0,
          boxShadow: '0 4px 24px rgba(33,150,243,0.08)',
          padding: '3.5rem 1.5rem 2.5rem 1.5rem',
          margin: 0,
          width: '100%',
          minHeight: '38vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          className="logo"
          style={{
            fontSize: '2.7rem',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: 1,
            textShadow: '0 2px 16px rgba(33,150,243,0.18)',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <img
            src="/logo192.png"
            alt="logo"
            style={{
              width: 54,
              height: 54,
              marginRight: 14,
              borderRadius: 14,
              background: '#fff',
            }}
          />
          Air Quality Tracker
        </span>
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: '#e3f2fd',
            fontWeight: 400,
            mb: 0,
            mt: 1,
            textShadow: '0 2px 8px #2196f355',
            maxWidth: 600,
          }}
        >
          Discover real-time air quality and pollution trends across the globe. Select a region below to begin exploring.
        </Typography>
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 160,
            height: 160,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -60,
            bottom: -60,
            width: 200,
            height: 200,
            background: 'rgba(255,255,255,0.10)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      </div>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
        sx={{
          maxWidth: '1200px',
          margin: { xs: '24px auto 0 auto', md: '40px auto 0 auto' },
          width: '100%',
          px: { xs: 1, sm: 2, md: 4 },
          mt: 0, // Remove negative margin to prevent overlap
          zIndex: 1,
          position: 'relative',
        }}
      >
        {regions.map((region) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={region.name} sx={{ display: 'flex' }}>
            <a href={region.path} style={{ textDecoration: 'none', flex: 1, width: '100%' }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  textAlign: 'center',
                  transition: '0.2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { boxShadow: 8, transform: 'translateY(-4px) scale(1.03)' },
                  background: 'rgba(255,255,255,0.95)',
                }}
              >
                <OptimizedImage src={region.img} alt={region.name} width={120} height={120} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#1976d2' }}>{region.name}</Typography>
              </Paper>
            </a>
          </Grid>
        ))}
      </Grid>
      {/* Removed BottomNavigation to avoid repetition with the top navigation bar */}
    </Box>
  );
}
