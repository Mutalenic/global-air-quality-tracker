import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getPollutionData } from '../../redux/Actions/Pollution';
import './Pollution.css';

const getAqiClass = (aqi) => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
};

const Pollution = ({
  lat,
  lng,
  flag,
  name,
}) => {
  const dispatch = useDispatch();
  const pollutions = useSelector((state) => state.pollutionReducer);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getPollutionData(lat, lng, flag, name));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, lat, lng, flag, name]);

  useEffect(() => {
    console.log('Flag URL:', flag); // Log the flag URL to verify
  }, [flag]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading pollution data:
        {error.message}
      </div>
    );
  }

  if (!Array.isArray(pollutions) || pollutions.length === 0) {
    return <div>No pollution data available.</div>;
  }

  return (
    <div className="pollutionContainer">
      {pollutions.map((pollution) => (
        <div key={pollution.id} className="pollutionCard">
          <h3>{pollution.city}</h3>
          <div className="pollutionFlagCard">
            <img src={flag} alt={`${pollution.city} flag`} className="pollutionFlag" />
          </div>
          <div className="pollutionDataCard aqiCard">
            <p>Air Quality Index:</p>
            <span className={`aqi ${getAqiClass(pollution.aqi)}`}>
              {pollution.aqi}
            </span>
          </div>
          <div className="pollutionDataCard pm25Card">
            <p>PM2.5:</p>
            <span>
              {pollution.pm25}
              {' '}
              µg/m³
            </span>
          </div>
          <div className="pollutionDataCard pm10Card">
            <p>PM10:</p>
            <span>
              {pollution.pm10}
              {' '}
              µg/m³
            </span>
          </div>
          <div className="pollutionDataCard o3Card">
            <p>O3:</p>
            <span>
              {pollution.o3}
              {' '}
              µg/m³
            </span>
          </div>
          <div className="pollutionDataCard no2Card">
            <p>NO2:</p>
            <span>
              {pollution.no2}
              {' '}
              µg/m³
            </span>
          </div>
          <div className="pollutionDataCard so2Card">
            <p>SO2:</p>
            <span>
              {pollution.so2}
              {' '}
              µg/m³
            </span>
          </div>
          <div className="pollutionDataCard coCard">
            <p>CO:</p>
            <span>
              {pollution.co}
              {' '}
              µg/m³
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

Pollution.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  flag: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Pollution;
