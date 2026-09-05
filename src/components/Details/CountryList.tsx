import React from 'react';
import Country from '../Home/Country';
import { Country as CountryType } from '../../store/useAppStore';

interface CountryListProps {
  countries: CountryType[];
}

/**
 * CountryList component displaying a grid of countries
 */
const CountryList: React.FC<CountryListProps> = React.memo(({ countries }) => {
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
          key={country.cca2}
          id={country.cca2}
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

export default CountryList;
