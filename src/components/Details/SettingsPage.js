import React from 'react';
import {
  Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Button, Autocomplete, TextField,
} from '@mui/material';

export default function SettingsPage() {
  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>Personalization</Typography>
      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <FormLabel component="legend">Theme</FormLabel>
        <RadioGroup row defaultValue="light">
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
        </RadioGroup>
      </FormControl>
      <Autocomplete
        options={['General', 'Asthma', 'Athlete']}
        renderInput={() => <TextField label="Health Sensitivity" />}
      />
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>About</Typography>
      <Typography variant="body2">Version: 1.0.0</Typography>
      <Button variant="outlined" fullWidth sx={{ mt: 2 }}>Feedback</Button>
    </Paper>
  );
}
