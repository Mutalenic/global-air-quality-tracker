import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getPollutionData } from '../../redux/Actions/Pollution';
import { getOpenAQLatest } from '../../redux/Actions/Weather';
import Weather from '../Weather/Weather';
import PollutionChart from './PollutionChart';
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
  const openAQLatest = useSelector((state) => state.weatherReducer.openAQLatest);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getPollutionData(lat, lng, flag, name));
        await dispatch(getOpenAQLatest({ city: name }));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
    // Optionally, set up periodic refresh for OpenAQ
    const interval = setInterval(() => {
      dispatch(getOpenAQLatest({ city: name }));
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [dispatch, lat, lng, flag, name]);

  // Helper to get OpenAQ values for this city
  const getOpenAQC = (param) => {
    if (openAQLatest && openAQLatest.results) {
      const cityResult = openAQLatest.results.find((r) => r.city === name);
      if (cityResult && cityResult.measurements && cityResult.measurements.length > 0) {
        const found = cityResult.measurements.find((m) => m.parameter === param);
        return found ? found.value : null;
      }
    }
    return null;
  };

  if (loading) {
    return <div>Loading air quality data...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading pollution data:
        {error.message}
      </div>
    );
  }

  if (openAQLatest && openAQLatest.error) {
    return (
      <div>
        Error loading OpenAQ data:
        <br />
        {openAQLatest.error}
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

          <div className="toggleButtons">
            <button
              type="button"
              onClick={() => setShowWeather(!showWeather)}
              className="weatherToggleButton"
            >
              {showWeather ? 'Hide Weather' : 'Show Weather'}
            </button>
            <button
              type="button"
              onClick={() => setShowChart(!showChart)}
              className="chartToggleButton"
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>

          {showWeather && (
            <Weather lat={lat} lng={lng} city={pollution.city} />
          )}

          {showChart && (
            <PollutionChart pollutionData={pollution} />
          )}

          <div className="pollutionDataCard aqiCard">
            <p>Air Quality Index:</p>
            <span className={`aqi ${getAqiClass(pollution.aqi)}`}>
              {getOpenAQC('pm25') !== null ? Math.round(getOpenAQC('pm25')) : pollution.aqi}
              {getOpenAQC('pm25') !== null && <span className="source-label"> (OpenAQ)</span>}
            </span>
          </div>
          <div className="pollutionDataCard pm25Card">
            <p>PM2.5:</p>
            <span>
              {getOpenAQC('pm25') !== null ? getOpenAQC('pm25') : pollution.pm25}
              {' '}
              µg/m³
              {getOpenAQC('pm25') !== null && <span className="source-label"> (OpenAQ)</span>}
            </span>
          </div>
          <div className="pollutionDataCard pm10Card">
            <p>PM10:</p>
            <span>
              {getOpenAQC('pm10') !== null ? getOpenAQC('pm10') : pollution.pm10}
              {' '}
              µg/m³
              {getOpenAQC('pm10') !== null && <span className="source-label"> (OpenAQ)</span>}
            </span>
          </div>
          <div className="pollutionDataCard o3Card">
            <p>O3:</p>
            <span>
              {getOpenAQC('o3') !== null ? getOpenAQC('o3') : pollution.o3}
              {' '}
              µg/m³
              {getOpenAQC('o3') !== null && <span className="source-label"> (OpenAQ)</span>}
            </span>
          </div>
          <div className="pollutionDataCard no2Card">
            <p>NO2:</p>
            <span>
              {getOpenAQC('no2') !== null ? getOpenAQC('no2') : pollution.no2}
              {' '}
              µg/m³
              {getOpenAQC('no2') !== null && <span className="source-label"> (OpenAQ)</span>}
            </span>
          </div>
          <div className="pollutionDataCard so2Card">
            <p>SO2:</p>
            <span>
              {getOpenAQC('so2') !== null ? getOpenAQC('so2') : pollution.so2}
              {' '}
              µg/m³
              {getOpenAQC('so2') !== null && <span className="source-label"> (OpenAQ)</span>}
            </span>
          </div>
          <div className="pollutionDataCard coCard">
            <p>CO:</p>
            <span>
              {getOpenAQC('co') !== null ? getOpenAQC('co') : pollution.co}
              {' '}
              µg/m³
              {getOpenAQC('co') !== null && <span className="source-label"> (OpenAQ)</span>}
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
