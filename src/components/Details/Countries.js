import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Africa from '../Maps/Africa.png';
import Antarctic from '../Maps/Antarctica.png';
import Asia from '../Maps/Asia.png';
import Europe from '../Maps/Europe.png';
import Oceania from '../Maps/Oceania.png';
import Navbar from '../Navbar/Navbar';
import America from '../Maps/America.png';
import Country from '../Home/Country';
import './Countries.css';

const Countries = () => {
  const countries = useSelector((state) => state.countriesReducer);
  const [search, setSearch] = useState('');
  const [showMore, setShowMore] = useState(false);

  const handleSeeMore = () => {
    setShowMore(true);
  };

  // eslint-disable-next-line max-len
  const searchedValue = countries.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase()));
  const displayedCountries = showMore ? searchedValue : searchedValue.slice(0, 6);

  if (!countries.length) {
    return (
      <div className="m-2">
        <p>Loading please wait!</p>
        <NavLink to="/" className="reloadText">
          <p>Click to reload</p>
          <FontAwesomeIcon icon={faRefresh} className="icon" text="reload" />
        </NavLink>
      </div>
    );
  }

  let region1 = countries[0].region;
  if (region1 === 'Africa') region1 = Africa;
  else if (region1 === 'Asia') region1 = Asia;
  else if (region1 === 'Europe') region1 = Europe;
  else if (region1 === 'Oceania') region1 = Oceania;
  else if (region1 === 'America') region1 = America;
  else region1 = Antarctic;

  return (
    <div>
      <Navbar id="/" />
      <div className="countryContainer">
        <div>
          <h3>{countries[0].region}</h3>
          <img src={region1} alt="Europe" className="img1" />
        </div>
        <div>
          <input type="text" placeholder="search country" className="searchCountry" onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="countriesGrid">
          {
            displayedCountries.map((country) => (
              <Country
                key={country.code}
                id={country.code}
                name={country.name.common}
                lat={country.latlng[0]}
                lng={country.latlng[1]}
                population={country.population}
                region={country.region}
                flag={country.flag}
              />
            ))
          }
        </div>
        {!showMore && (
          <button type="button" className="seeMoreButton" onClick={handleSeeMore}>
            See More
          </button>
        )}
      </div>
    </div>
  );
};

export default Countries;
