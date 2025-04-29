import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getPollutionData } from '../../redux/Actions/Pollution';
import './Country.css';

const Country = (props) => {
  const {
    name, lat, lng, population, flag,
  } = props;
  const dispatch = useDispatch();

  return (
    <NavLink
      to="/pollution"
      className="card country-card-link"
      aria-label={`View pollution details for ${name}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onClick={() => {
        dispatch(getPollutionData(parseFloat(lat), parseFloat(lng), flag, name));
      }}
    >
      <div className="flex-column" style={{ alignItems: 'center' }}>
        <img src={flag} alt={`Flag of ${name}`} className="img" style={{ margin: '0 auto' }} />
        <p className="populationTotal" style={{ margin: '12px 0 0 0', fontWeight: 500 }}>
          <span aria-label="Population">Population:</span>
          {' '}
          <span aria-label={`Population of ${name}`}>{population.toLocaleString()}</span>
        </p>
      </div>
    </NavLink>
  );
};

Country.propTypes = {
  name: PropTypes.string.isRequired,
  flag: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  population: PropTypes.number.isRequired,
};

export default Country;
