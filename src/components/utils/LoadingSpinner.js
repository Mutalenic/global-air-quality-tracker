import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={120}>
    <CircularProgress color="primary" />
    <Typography sx={{ mt: 2 }}>Loading air quality data...</Typography>
  </Box>
);

export default LoadingSpinner;
