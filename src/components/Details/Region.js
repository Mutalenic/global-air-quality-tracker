import React, { useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Africa from '../Maps/Africa.png';
import Antarctic from '../Maps/Antarctica.png';
import Asia from '../Maps/Asia.png';
import Europe from '../Maps/Europe.png';
import America from '../Maps/America.png';
import Oceania from '../Maps/Oceania.png';
import { getCountries } from '../../redux/Actions/Countries';
import './Region.css';

// Map region names to images for better performance
const regionImageMap = {
  Africa,
  Asia,
  Europe,
  Oceania,
  America,
  Americas: America, // Handle both 'America' and 'Americas'
  Antarctic,
};

const Region = React.memo((props) => {
  const { region, regionCountry } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoize the region image to avoid recalculation
  const regionImage = useMemo(() => regionImageMap[region] || Antarctic, [region]);

  // Memoize the click handler - dispatch action then navigate after a brief delay
  const handleRegionClick = useCallback(() => {
    console.log('Region clicked, dispatching getCountries for:', region);
    dispatch(getCountries(region));
    // Increased delay to ensure Redux state updates before navigation
    setTimeout(() => {
      console.log('Navigating to countries page');
      navigate('/countries');
    }, 100); // Increased from 50ms to 100ms for better reliability
  }, [dispatch, region, navigate]);

  return (
    <div className="regionBorder">
      <div className="region">
        <div className="flex-column">
          <img src={regionImage} alt={`${region} map`} className="m-2 img" loading="lazy" />
          <div className="regionDetails">
            <button
              key={region}
              type="button"
              className="regionBtn"
              onClick={handleRegionClick}
              aria-label={`View countries in ${region}`}
            >
              <FontAwesomeIcon icon={faCircleArrowRight} className="icon" aria-hidden="true" />
            </button>
            <p className="regionName">{region}</p>
            <p>{regionCountry} Countries</p>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
});

Region.displayName = 'Region';

Region.propTypes = {
  region: PropTypes.string.isRequired,
  regionCountry: PropTypes.number.isRequired,
};

export default Region;
