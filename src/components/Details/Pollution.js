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
  const { pollutionData, error: reduxError } = useSelector((state) => state.pollutionReducer);
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

  // Show the Redux error if one exists
  if (reduxError) {
    return (
      <div className="error-container">
        <h3>Error loading pollution data:</h3>
        <p>{reduxError}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading data:</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (openAQLatest && openAQLatest.error) {
    return (
      <div className="error-container">
        <h3>Error loading OpenAQ data:</h3>
        <p>{openAQLatest.error}</p>
      </div>
    );
  }

  // Find the latest or matching pollution data for the selected country
  let pollutionToShow = null;
  if (Array.isArray(pollutionData) && pollutionData.length > 0) {
    // Try to find by city/name, fallback to last item
    pollutionToShow = pollutionData.find((p) => p.city === name) || pollutionData[pollutionData.length - 1];
  }

  if (!pollutionToShow) {
    return <div>No pollution data available.</div>;
  }

  return (
    <section className="pollutionContainer" aria-label="Pollution details">
      <article key={pollutionToShow.id} className="card" aria-label={`Pollution card for ${pollutionToShow.city}`}>
        <h3>{pollutionToShow.city}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <img src={pollutionToShow.flag} alt={`${pollutionToShow.city} flag`} style={{ width: 64, borderRadius: '50%' }} />
        </div>
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16,
        }}
        >
          <button
            type="button"
            className="btn-primary"
            aria-label={showWeather ? 'Hide Weather' : 'Show Weather'}
            onClick={() => setShowWeather(!showWeather)}
          >
            {showWeather ? 'Hide Weather' : 'Show Weather'}
          </button>
          <button
            type="button"
            className="btn-primary"
            aria-label={showChart ? 'Hide Chart' : 'Show Chart'}
            onClick={() => setShowChart(!showChart)}
          >
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </button>
        </div>
        {showWeather && (
          <Weather lat={lat} lng={lng} city={pollutionToShow.city} />
        )}
        {showChart && (
          <PollutionChart pollutionData={pollutionToShow} />
        )}
        <div className="pollutionDataCard aqiCard">
          <p>Air Quality Index:</p>
          <span className={`aqi ${getAqiClass(pollutionToShow.aqi)}`}>
            {getOpenAQC('pm25') !== null
              ? (
                <>
                  {Math.round(getOpenAQC('pm25'))}
                  {getOpenAQC('pm25') !== null && (
                    <span className="source-label"> (OpenAQ)</span>
                  )}
                </>
              )
              : pollutionToShow.aqi}
          </span>
        </div>
        <div className="pollutionDataCard pm25Card">
          <p>PM2.5:</p>
          <span>
            {getOpenAQC('pm25') !== null
              ? (
                <>
                  {getOpenAQC('pm25')}
                  <br />
                  µg/m³
                  {getOpenAQC('pm25') !== null && (
                    <span className="source-label"> (OpenAQ)</span>
                  )}
                </>
              )
              : (
                <>
                  {pollutionToShow.pm25}
                  <br />
                  µg/m³
                </>
              )}
          </span>
        </div>
        <div className="pollutionDataCard pm10Card">
          <p>PM10:</p>
          <span>
            {getOpenAQC('pm10') !== null
              ? (
                <>
                  {getOpenAQC('pm10')}
                  <br />
                  µg/m³
                  {getOpenAQC('pm10') !== null && (
                    <span className="source-label"> (OpenAQ)</span>
                  )}
                </>
              )
              : (
                <>
                  {pollutionToShow.pm10}
                  <br />
                  µg/m³
                </>
              )}
          </span>
        </div>
        <div className="pollutionDataCard o3Card">
          <p>O3:</p>
          <span>
            {getOpenAQC('o3') !== null
              ? (
                <>
                  {getOpenAQC('o3')}
                  <br />
                  µg/m³
                  {getOpenAQC('o3') !== null && (
                    <span className="source-label"> (OpenAQ)</span>
                  )}
                </>
              )
              : (
                <>
                  {pollutionToShow.o3}
                  <br />
                  µg/m³
                </>
              )}
          </span>
        </div>
        <div className="pollutionDataCard no2Card">
          <p>NO2:</p>
          <span>
            {getOpenAQC('no2') !== null
              ? (
                <>
                  {getOpenAQC('no2')}
                  <br />
                  µg/m³
                  {getOpenAQC('no2') !== null && (
                    <span className="source-label"> (OpenAQ)</span>
                  )}
                </>
              )
              : (
                <>
                  {pollutionToShow.no2}
                  <br />
                  µg/m³
                </>
              )}
          </span>
        </div>
        <div className="pollutionDataCard so2Card">
          <p>SO2:</p>
          <span>
            {getOpenAQC('so2') !== null
              ? (
                <>
                  {getOpenAQC('so2')}
                  <br />
                  µg/m³
                  {getOpenAQC('so2') !== null && (
                    <span className="source-label"> (OpenAQ)</span>
                  )}
                </>
              )
              : (
                <>
                  {pollutionToShow.so2}
                  <br />
                  µg/m³
                </>
              )}
          </span>
        </div>
        <div className="pollutionDataCard coCard">
          <p>CO:</p>
          <span>
            {getOpenAQC('co') !== null
              ? (
                <>
                  {getOpenAQC('co')}
                  <br />
                  µg/m³
                  {getOpenAQC('co') !== null && (
                    <span className="source-label"> (OpenAQ)</span>
                  )}
                </>
              )
              : (
                <>
                  {pollutionToShow.co}
                  <br />
                  µg/m³
                </>
              )}
          </span>
        </div>
      </article>
    </section>
  );
};

Pollution.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  flag: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Pollution;
