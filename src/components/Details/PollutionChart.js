import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, Area, AreaChart, ComposedChart, Brush,
} from 'recharts';
import { format, subDays } from 'date-fns';
import {
  Box, Paper, Typography, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, FormGroup, FormControlLabel, Chip,
} from '@mui/material';

// Color scheme based on air quality levels (good to dangerous)
const COLORS = {
  good: '#4caf50',
  moderate: '#ffeb3b',
  unhealthySensitive: '#ff9800',
  unhealthy: '#f44336',
  veryUnhealthy: '#9c27b0',
  hazardous: '#880e4f',
};

// Get color based on pollution value and pollutant type
const getPollutantColor = (value, pollutant) => {
  // Thresholds based on standard AQI classifications (simplified)
  const thresholds = {
    pm25: [12, 35.4, 55.4, 150.4, 250.4],
    pm10: [54, 154, 254, 354, 424],
    o3: [54, 70, 85, 105, 200],
    no2: [53, 100, 360, 649, 1249],
    so2: [35, 75, 185, 304, 604],
    co: [4400, 9400, 12400, 15400, 30400],
  };

  const threshold = thresholds[pollutant] || thresholds.pm25;

  if (value <= threshold[0]) return COLORS.good;
  if (value <= threshold[1]) return COLORS.moderate;
  if (value <= threshold[2]) return COLORS.unhealthySensitive;
  if (value <= threshold[3]) return COLORS.unhealthy;
  if (value <= threshold[4]) return COLORS.veryUnhealthy;
  return COLORS.hazardous;
};

// Function to determine health effect text based on pollutant and value
const getHealthEffect = (pollutantKey, value) => {
  if (pollutantKey === 'co') {
    const displayValue = value * 100;
    if (displayValue < 4400) return 'Good: Little to no health risk.';
    if (displayValue < 9400) return 'Moderate: Few sensitive individuals may have symptoms.';
    if (displayValue < 12400) {
      return 'Unhealthy for Sensitive Groups: Heart patients at risk.';
    }
    return 'Unhealthy: Increased risk for all, especially sensitive groups.';
  }

  if (pollutantKey === 'pm25') {
    if (value < 12) return 'Good: Little to no health risk.';
    if (value < 35.4) {
      return 'Moderate: Unusually sensitive people should reduce outdoor activity.';
    }
    if (value < 55.4) {
      return 'Unhealthy for Sensitive Groups: Limit activity if respiratory issues.';
    }
    return 'Unhealthy: Everyone may begin to experience health effects.';
  }

  if (pollutantKey === 'pm10') {
    if (value < 54) return 'Good: Little to no health risk.';
    if (value < 154) {
      return 'Moderate: Unusually sensitive people should consider limiting outdoor activities.';
    }
    if (value < 254) {
      return 'Unhealthy for Sensitive Groups: People with respiratory issues should limit exertion.';
    }
    return 'Unhealthy: Everyone may begin to experience health effects.';
  }

  return '';
};

const PollutionChart = ({ pollutionData }) => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('day');
  const [selectedPollutants, setSelectedPollutants] = useState(['pm25', 'pm10', 'o3', 'no2', 'so2', 'co']);

  // Chart type options
  const chartOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'composed', label: 'Composed Chart' },
  ];

  // Time range options
  const timeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
  ];

  // Pollutant options for selection
  const pollutantOptions = [
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'o3', label: 'O3 (Ozone)' },
    { value: 'no2', label: 'NO2 (Nitrogen Dioxide)' },
    { value: 'so2', label: 'SO2 (Sulfur Dioxide)' },
    { value: 'co', label: 'CO (Carbon Monoxide)' },
  ];

  // Determine the data key for X-axis based on the selected time range
  const getXAxisDataKey = () => (timeRange === 'current' ? 'name' : 'date');

  // Function to create a custom label for pollutant options
  const getPollutantLabel = (pollutant) => pollutantOptions.find((opt) => opt.value === pollutant)?.label || pollutant.toUpperCase();

  // Determine time range based on selection
  const getTimeRangeDays = () => {
    if (timeRange === 'day') return 1;
    if (timeRange === 'week') return 7;
    return 30; // month
  };

  // Generate mock historical data for time series
  const generateHistoricalData = useMemo(() => {
    const data = [];
    const days = getTimeRangeDays();

    for (let i = days; i >= 0; i -= 1) {
      const date = subDays(new Date(), i);
      const formattedDate = format(date, 'MMM dd');

      // Base values from current data with small random variations for historical simulation
      const baseValues = { ...pollutionData };

      const entry = {
        date: formattedDate,
        // Add slight variations to simulate historical data
        pm25: Math.max(1, baseValues.pm25 * (0.8 + Math.random() * 0.4)),
        pm10: Math.max(1, baseValues.pm10 * (0.8 + Math.random() * 0.4)),
        o3: Math.max(1, baseValues.o3 * (0.8 + Math.random() * 0.4)),
        no2: Math.max(1, baseValues.no2 * (0.8 + Math.random() * 0.4)),
        so2: Math.max(1, baseValues.so2 * (0.8 + Math.random() * 0.4)),
        co: Math.max(10, baseValues.co * (0.8 + Math.random() * 0.4)),
      };

      data.push(entry);
    }

    return data;
  }, [pollutionData, timeRange]);

  // Transform current pollution data for single-point chart
  const currentChartData = useMemo(() => [
    { name: 'PM2.5', value: pollutionData.pm25, fill: getPollutantColor(pollutionData.pm25, 'pm25') },
    { name: 'PM10', value: pollutionData.pm10, fill: getPollutantColor(pollutionData.pm10, 'pm10') },
    { name: 'O3', value: pollutionData.o3, fill: getPollutantColor(pollutionData.o3, 'o3') },
    { name: 'NO2', value: pollutionData.no2, fill: getPollutantColor(pollutionData.no2, 'no2') },
    { name: 'SO2', value: pollutionData.so2, fill: getPollutantColor(pollutionData.so2, 'so2') },
    { name: 'CO', value: pollutionData.co / 100, fill: getPollutantColor(pollutionData.co, 'co') },
  ].filter((item) => selectedPollutants.includes(item.name.toLowerCase())), [pollutionData, selectedPollutants]);

  // Custom tooltip component with health information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const pollutantName = data.name || label;
      const pollutantKey = pollutantName.toLowerCase();
      const { value } = data;
      const unit = 'µg/m³';
      let displayValue = value;

      // Adjust CO value for display and set health effects
      if (pollutantKey === 'co') {
        displayValue *= 100;
      }

      const healthEffect = getHealthEffect(pollutantKey, displayValue);

      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${pollutantName}: ${displayValue.toFixed(2)} ${unit}`}</p>
          <p className="tooltip-health-effect">{healthEffect}</p>
        </div>
      );
    }
    return null;
  };

  // Define prop types for CustomTooltip
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })),
    label: PropTypes.string,
  };

  // Default props for CustomTooltip
  CustomTooltip.defaultProps = {
    active: false,
    payload: [],
    label: '',
  };

  // Function to render appropriate chart based on selected type
  const renderChart = () => {
    const commonProps = {
      data: timeRange === 'current' ? currentChartData : generateHistoricalData,
      margin: {
        top: 10, right: 30, left: 20, bottom: 40,
      },
    };

    // Set the key based on selected pollutants for time series charts
    const dataKey = timeRange === 'current' ? 'value' : null;

    switch (chartType) {
      case 'line':
        return (
          <LineChart data={commonProps.data} margin={commonProps.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={getXAxisDataKey()}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {timeRange === 'current' ? (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            ) : (
              selectedPollutants.map((pollutant, index) => (
                <Line
                  key={pollutant}
                  type="monotone"
                  dataKey={pollutant}
                  name={getPollutantLabel(pollutant)}
                  stroke={Object.values(COLORS)[index % Object.values(COLORS).length]}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              ))
            )}
            {timeRange !== 'current' && (
              <Brush
                dataKey="date"
                height={30}
                stroke="#8884d8"
                startIndex={Math.max(0, generateHistoricalData.length - 7)}
              />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={commonProps.data} margin={commonProps.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={getXAxisDataKey()}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {timeRange === 'current' ? (
              <Area
                type="monotone"
                dataKey={dataKey}
                fill="#8884d8"
                stroke="#8884d8"
                fillOpacity={0.6}
              />
            ) : (
              selectedPollutants.map((pollutant, index) => (
                <Area
                  key={pollutant}
                  type="monotone"
                  dataKey={pollutant}
                  name={getPollutantLabel(pollutant)}
                  fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                  stroke={Object.values(COLORS)[index % Object.values(COLORS).length]}
                  fillOpacity={0.6}
                />
              ))
            )}
            {timeRange !== 'current' && (
              <Brush
                dataKey="date"
                height={30}
                stroke="#8884d8"
              />
            )}
          </AreaChart>
        );

      case 'composed':
        return (
          <ComposedChart data={commonProps.data} margin={commonProps.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={getXAxisDataKey()}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {timeRange === 'current' ? (
              <>
                <Bar dataKey={dataKey} fill="#8884d8" />
                <Line type="monotone" dataKey={dataKey} stroke="#ff7300" />
              </>
            ) : (
              selectedPollutants.map((pollutant, index) => (
                <React.Fragment key={pollutant}>
                  <Bar
                    dataKey={pollutant}
                    name={`${getPollutantLabel(pollutant)} (Bar)`}
                    fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                    fillOpacity={0.6}
                  />
                  <Line
                    type="monotone"
                    dataKey={pollutant}
                    name={`${getPollutantLabel(pollutant)} (Line)`}
                    stroke={Object.values(COLORS)[index % Object.values(COLORS).length]}
                    strokeWidth={2}
                  />
                </React.Fragment>
              ))
            )}
            {timeRange !== 'current' && (
              <Brush
                dataKey="date"
                height={30}
                stroke="#8884d8"
              />
            )}
          </ComposedChart>
        );

      default: // Bar chart
        return (
          <BarChart data={commonProps.data} margin={commonProps.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={getXAxisDataKey()}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {timeRange === 'current' ? (
              <Bar
                dataKey={dataKey}
                name="Value (µg/m³)"
                // Use fill from the data point
                fillGradient={{
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                  stops: [
                    { offset: 0, stopColor: '#8884d8', stopOpacity: 0.8 },
                    { offset: 1, stopColor: '#8884d8', stopOpacity: 0.4 },
                  ],
                }}
              />
            ) : (
              selectedPollutants.map((pollutant, index) => (
                <Bar
                  key={pollutant}
                  dataKey={pollutant}
                  name={getPollutantLabel(pollutant)}
                  fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                />
              ))
            )}
            {timeRange !== 'current' && (
              <Brush
                dataKey="date"
                height={30}
                stroke="#8884d8"
              />
            )}
          </BarChart>
        );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, my: 4 }}>
      <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>Air Pollution Analysis</Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="chart-type-label">Chart Type</InputLabel>
          <MuiSelect
            labelId="chart-type-label"
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value)}
          >
            {chartOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <MuiSelect
            labelId="time-range-label"
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
        <FormControl component="fieldset" sx={{ minWidth: 200 }}>
          <Typography variant="caption" sx={{ mb: 1 }}>Pollutants</Typography>
          <FormGroup row>
            {pollutantOptions.map((opt) => (
              <FormControlLabel
                key={opt.value}
                control={(
                  <Checkbox
                    checked={selectedPollutants.includes(opt.value)}
                    onChange={() => {
                      setSelectedPollutants(selectedPollutants.includes(opt.value)
                        ? selectedPollutants.filter((p) => p !== opt.value)
                        : [...selectedPollutants, opt.value]);
                    }}
                  />
                )}
                label={opt.label}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>
      <Box display="flex" gap={2} mb={2}>
        <Chip label="Good" sx={{ bgcolor: COLORS.good, color: '#fff' }} />
        <Chip label="Moderate" sx={{ bgcolor: COLORS.moderate, color: '#333' }} />
        <Chip label="Unhealthy" sx={{ bgcolor: COLORS.unhealthy, color: '#fff' }} />
        <Chip label="Very Unhealthy" sx={{ bgcolor: COLORS.veryUnhealthy, color: '#fff' }} />
        <Chip label="Hazardous" sx={{ bgcolor: COLORS.hazardous, color: '#fff' }} />
      </Box>
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </Box>
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        This chart displays air pollution data for the selected pollutants. The colors indicate the pollution level severity according to standard air quality indices.
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        <strong>Note:</strong>
        {' '}
        CO values are scaled by a factor of 100 for better visualization.
      </Typography>
    </Paper>
  );
};

PollutionChart.propTypes = {
  pollutionData: PropTypes.shape({
    pm25: PropTypes.number.isRequired,
    pm10: PropTypes.number.isRequired,
    o3: PropTypes.number.isRequired,
    no2: PropTypes.number.isRequired,
    so2: PropTypes.number.isRequired,
    co: PropTypes.number.isRequired,
  }).isRequired,
};

export default PollutionChart;
