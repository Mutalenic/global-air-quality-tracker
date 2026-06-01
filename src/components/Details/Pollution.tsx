import React from 'react';
import { PollutionData } from '../../store/useAppStore';
import './Pollution.css';

interface PollutionProps {
  pollution: PollutionData;
}

const getAqiClass = (aqi: number): string => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
};

const Pollution: React.FC<PollutionProps> = ({ pollution }) => {
  const { city, flag, aqi, pm25, pm10, o3, no2, so2, co } = pollution;

  return (
    <div className="pollutionCard">
      <h3>{city}</h3>
      <div className="pollutionFlagCard">
        <img src={flag} alt={`${city} flag`} className="pollutionFlag" />
      </div>
      <div className="pollutionDataCard aqiCard">
        <p>Air Quality Index:</p>
        <span className={`aqi ${getAqiClass(aqi)}`}>{aqi}</span>
      </div>
      <div className="pollutionDataCard pm25Card">
        <p>PM2.5:</p>
        <span>{pm25} µg/m³</span>
      </div>
      <div className="pollutionDataCard pm10Card">
        <p>PM10:</p>
        <span>{pm10} µg/m³</span>
      </div>
      <div className="pollutionDataCard o3Card">
        <p>O3:</p>
        <span>{o3} µg/m³</span>
      </div>
      <div className="pollutionDataCard no2Card">
        <p>NO2:</p>
        <span>{no2} µg/m³</span>
      </div>
      <div className="pollutionDataCard so2Card">
        <p>SO2:</p>
        <span>{so2} µg/m³</span>
      </div>
      <div className="pollutionDataCard coCard">
        <p>CO:</p>
        <span>{co} µg/m³</span>
      </div>
    </div>
  );
};


export default Pollution;
