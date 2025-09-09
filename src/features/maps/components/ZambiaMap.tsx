import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { config } from '../../shared/config';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';

// Use require for static assets that don't have type declarations
const icon = require('leaflet/dist/images/marker-icon.png');
const iconShadow = require('leaflet/dist/images/marker-shadow.png');

const DefaultIcon = L.icon({
  iconUrl: icon.default || icon,
  shadowUrl: iconShadow.default || iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AQIPoint {
  id: string;
  name: string;
  position: LatLngExpression;
  aqi: number;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    co: number;
  };
}

interface ZambiaMapProps {
  aqiPoints?: AQIPoint[];
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
}

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#00E400'; // Good
  if (aqi <= 100) return '#FFFF00'; // Moderate
  if (aqi <= 150) return '#FF7E00'; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return '#FF0000'; // Unhealthy
  if (aqi <= 300) return '#8F3F97'; // Very Unhealthy
  return '#7E0023'; // Hazardous
};

const getAQILabel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const ZambiaMap: React.FC<ZambiaMapProps> = ({
  aqiPoints = [],
  center = [config.map.defaultCenter.lat, config.map.defaultCenter.lng],
  zoom = 6,
  className = '',
}) => {
  // Default AQI monitoring locations in Zambia
  const defaultPoints: AQIPoint[] = [
    {
      id: 'lusaka',
      name: 'Lusaka City Center',
      position: [-15.4167, 28.2833],
      aqi: 45,
      pollutants: { pm25: 12, pm10: 20, no2: 8, co: 0.5 },
    },
    {
      id: 'ndola',
      name: 'Ndola Industrial Area',
      position: [-12.9587, 28.6366],
      aqi: 78,
      pollutants: { pm25: 25, pm10: 35, no2: 15, co: 1.2 },
    },
    {
      id: 'kitwe',
      name: 'Kitwe Mining District',
      position: [-12.8024, 28.2132],
      aqi: 82,
      pollutants: { pm25: 28, pm10: 38, no2: 18, co: 1.5 },
    },
    {
      id: 'livingstone',
      name: 'Livingstone Tourism Hub',
      position: [-17.8419, 25.8561],
      aqi: 32,
      pollutants: { pm25: 8, pm10: 15, no2: 5, co: 0.3 },
    },
  ];

  const points = aqiPoints.length > 0 ? aqiPoints : defaultPoints;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`zambia-map ${className}`}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {points.map((point) => (
        <CircleMarker
          key={point.id}
          center={point.position}
          radius={15}
          pathOptions={{
            color: getAQIColor(point.aqi),
            fillColor: getAQIColor(point.aqi),
            fillOpacity: 0.7,
            weight: 2,
          }}
        >
          <Popup>
            <div className="aqi-popup">
              <h3>{point.name}</h3>
              <div className="aqi-info">
                <div className="aqi-value" style={{ color: getAQIColor(point.aqi) }}>
                  AQI: {point.aqi}
                </div>
                <div className="aqi-status">{getAQILabel(point.aqi)}</div>
              </div>
              <div className="pollutants">
                <div>PM2.5: {point.pollutants.pm25} μg/m³</div>
                <div>PM10: {point.pollutants.pm10} μg/m³</div>
                <div>NO₂: {point.pollutants.no2} μg/m³</div>
                <div>CO: {point.pollutants.co} mg/m³</div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default ZambiaMap;