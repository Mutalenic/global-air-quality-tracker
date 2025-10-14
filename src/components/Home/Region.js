import React from 'react';
import Header from '../Navbar/Navbar';
import Region from '../Details/Region';
import World from '../Maps/img/worldmap.jpg';
import './Region.css';

const Regions = () => {
  const regionList = [
    { region: 'Africa', country: 59 },
    { region: 'Americas', country: 56 },
    { region: 'Europe', country: 53 },
    { region: 'Asia', country: 50 },
    { region: 'Oceania', country: 27 },
    { region: 'Antarctic', country: 5 },
  ];
  return (
    <div>
      <Header id="/" />
      <div className="world-container">
        <img src={World} alt="world map" className="world-map" />
        <div className="centered">
          <h3>Find Air Quality Data in your Location</h3>
        </div>
      </div>
      <div className="row">
        {regionList.map((element) => (
          <Region key={element.region} region={element.region} regionCountry={element.country} />
        ))}
      </div>
    </div>
  );
};

export default Regions;
