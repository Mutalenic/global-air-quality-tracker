import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import Pollution from '../Details/Pollution';
import Weather from '../Weather/Weather';
import './Pollution.css';

const Pollutions = () => {
  const pollutions = useSelector((state) => state.pollutionReducer);

  return (
    <div className="pollution-page">
      <Navbar />
      <div className="pollution-page-content">
        <div className="pollution-header-section">
          <h1>Air Pollution Data</h1>
          <p className="pollution-subheading">
            Explore detailed pollution data and see how weather conditions impact air quality
          </p>
        </div>

        {pollutions.map((pollution) => (
          <div className="pollution-weather-container" key={pollution.id}>
            <Pollution
              id={pollution.id}
              lat={pollution.lat}
              lng={pollution.lng}
              co={pollution.co}
              no={pollution.no}
              no2={pollution.no2}
              flag={pollution.flag}
              name={pollution.city}
            />

            <div className="weather-impact-box">
              <h3>
                How Weather Affects
                {pollution.city}
                's Air Quality
              </h3>
              <div className="weather-data-box">
                <Weather latitude={pollution.lat} longitude={pollution.lng} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pollutions;
