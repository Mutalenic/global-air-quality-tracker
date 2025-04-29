import React from 'react';
import {
  Box, Typography, Card, Chip, Grid, Divider, Alert, SpeedDial, SpeedDialAction,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const pollutants = [
  {
    name: 'PM2.5', value: 48, color: 'warning', desc: 'Harmful for lungs',
  },
  {
    name: 'PM10', value: 60, color: 'error', desc: 'Dust particles',
  },
  {
    name: 'O3', value: 30, color: 'success', desc: 'Ozone',
  },
  {
    name: 'NO2', value: 22, color: 'info', desc: 'Traffic emissions',
  },
  {
    name: 'SO2', value: 10, color: 'secondary', desc: 'Industry',
  },
  {
    name: 'CO', value: 0.8, color: 'primary', desc: 'Combustion',
  },
];
const tips = [
  'Best time to go out: 6am–8am',
  'Avoid jogging during peak traffic',
];

export default function CityDetail() {
  return (
    <Card sx={{ p: 3, m: 2 }}>
      <Box textAlign="center" mb={2}>
        <Typography variant="h4">Lusaka 🌤️</Typography>
        <Chip label="Unhealthy for sensitive groups" color="warning" sx={{ mt: 1 }} />
        <Typography variant="h2" fontWeight="bold" mt={1}>AQI: 112</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} mb={2}>
        {pollutants.map((p) => (
          <Grid item xs={6} sm={4} key={p.name}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography color={`${p.color}.main`} fontWeight="bold">{p.name}</Typography>
              <Typography variant="h6">
                {p.value}
                {' '}
                µg/m³
              </Typography>
              <Typography variant="caption" color="text.secondary">{p.desc}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Alert severity="warning" sx={{ mb: 2 }}>
        Hazardous air quality! Avoid outdoor activity.
      </Alert>
      {/* <PollutionChart pollutionData={trendData} /> */}
      <Typography variant="h6" mt={2}>Daily Tips</Typography>
      <ul>
        {tips.map((tip) => <li key={tip}>{tip}</li>)}
      </ul>
      <SpeedDial
        ariaLabel="City actions"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<ShowChartIcon />}
      >
        <SpeedDialAction icon={<MapIcon />} tooltipTitle="Go to Map" />
        <SpeedDialAction icon={<ContentCopyIcon />} tooltipTitle="Copy Summary" />
        <SpeedDialAction icon={<ShowChartIcon />} tooltipTitle="View Trends" />
      </SpeedDial>
    </Card>
  );
}
