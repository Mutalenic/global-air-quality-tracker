import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../Navbar/Navbar';
import Pollution from '../Details/Pollution';
import './Pollution.css';

const Pollutions = () => {
  const pollutions = useSelector((state) => state.pollutionReducer);

  return (
    <div>
      <Header id="/countries" />
      {pollutions.map((pollution) => (
        <Pollution
          key={pollution.id} // Ensure unique keys by using a unique identifier
          id={pollution.id}
          lat={pollution.lat}
          lng={pollution.lng}
          co={pollution.co}
          no={pollution.no}
          no2={pollution.no2}
          flag={pollution.flag}
          name={pollution.city}
        />
      ))}
    </div>
  );
};

export default Pollutions;
