import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveWorldMap.css';
import { Box, Typography, Drawer, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const pollutantColors = {
  pm25: '#FFEB3B',
  pm10: '#FF9800',
  co: '#009688',
  no2: '#9C27B0',
  o3: '#4CAF50',
  so2: '#F44336',
};

const AQI_COLORS = [
  { max: 50, color: '#4CAF50' },
  { max: 100, color: '#FFEB3B' },
  { max: 150, color: '#FF9800' },
  { max: 200, color: '#F44336' },
  { max: 300, color: '#9C27B0' },
  { max: Infinity, color: '#D32F2F' },
];

function getAqiColor(aqi) {
  return AQI_COLORS.find((c) => aqi <= c.max).color;
}

const markers = [
  { lon: 28.3, lat: -15.4, aqi: 72 },
  { lon: 27.5, lat: -12.8, aqi: 120 },
  // ...more
];
const showFilters = true;

export default function MapPage() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [activeLayer, setActiveLayer] = useState('aqi');
  const [showHazardous, setShowHazardous] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!map) {
      const leafletMap = L.map(mapRef.current).setView([0, 20], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap);
      setMap(leafletMap);
    }
    // Clean up on unmount
    return () => map && map.remove();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });
    data.forEach((city) => {
      if (showHazardous && city.aqi < 200) return;
      const value = activeLayer === 'aqi' ? city.aqi : city[activeLayer];
      const color = activeLayer === 'aqi' ? getAqiColor(city.aqi) : pollutantColors[activeLayer];
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: 10,
        color,
        fillColor: color,
        fillOpacity: 0.8,
      }).addTo(map);
      marker.bindTooltip(
        `<b>${city.name}</b><br/>AQI: ${city.aqi}<br/>PM2.5: ${city.pm25} µg/m³<br/>CO: ${city.co} µg/m³`,
        { direction: 'top' },
      );
    });
  }, [map, data, activeLayer, showHazardous]);

  // FAB actions
  const [fabOpen, setFabOpen] = useState(false);
  const handleLayerToggle = (layer) => setActiveLayer(layer);
  const handleCenterLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 8);
      });
    }
  };
  const handleZoomIn = () => map && map.zoomIn();
  const handleZoomOut = () => map && map.zoomOut();

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <Box sx={{ height: '80vh', background: '#e0e0e0', mb: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">[Map goes here]</Typography>
      </Box>
      <Drawer anchor="bottom" open={showFilters}>
        <Box p={2}>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Show Hazardous Only" />
            <FormControlLabel control={<Checkbox />} label="Show PM2.5 Layer" />
          </FormGroup>
        </Box>
      </Drawer>
    </Box>
  );
}
