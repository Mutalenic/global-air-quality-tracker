import React from 'react';
import PropTypes from 'prop-types';
import Country from '../Home/Country';

/**
 * CountryList component displaying a grid of countries
 * @param {Array} countries - List of country objects
 */
const CountryList = React.memo(({ countries }) => {
  if (!countries || countries.length === 0) {
    return (
      <div className="empty-container">
        <p>No countries found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="countriesGrid">
      {countries.map((country) => (
        <Country
          key={country.code}
          id={country.code}
          name={country.name.common}
          lat={country.latlng[0]}
          lng={country.latlng[1]}
          population={country.population}
          region={country.region}
          flag={country.flags.png}
        />
      ))}
    </div>
  );
});

CountryList.displayName = 'CountryList';

CountryList.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.shape({
        common: PropTypes.string.isRequired,
      }).isRequired,
      latlng: PropTypes.arrayOf(PropTypes.number).isRequired,
      population: PropTypes.number.isRequired,
      region: PropTypes.string.isRequired,
      flags: PropTypes.shape({
        png: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};

export default CountryList;
