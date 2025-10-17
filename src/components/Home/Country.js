import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { getPollutionData } from '../../redux/Actions/Pollution';
import { useFavorites } from '../../hooks';
import { showSuccessToast } from '../../utils/toastUtils';
import './Country.css';

const Country = React.memo((props) => {
  const { id, name, lat, lng, population, flag, region } = props;
  const dispatch = useDispatch();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Memoize the click handler to prevent unnecessary re-renders
  const handlePollutionClick = useCallback(() => {
    dispatch(getPollutionData(parseInt(lat, 10), parseInt(lng, 10), flag, name));
  }, [dispatch, lat, lng, flag, name]);

  // Handle favorite toggle
  const handleFavoriteClick = useCallback(
    (e) => {
      e.stopPropagation();
      const location = { id, name, lat, lng, population, flag, region };
      toggleFavorite(location);
      showSuccessToast(
        isFavorite(id) ? `Removed ${name} from favorites` : `Added ${name} to favorites`,
        { autoClose: 2000 },
      );
    },
    [id, name, lat, lng, population, flag, region, toggleFavorite, isFavorite],
  );

  // Format population with commas for better readability
  const formattedPopulation = population.toLocaleString();
  const isLocationFavorite = isFavorite(id);

  return (
    <div className="mainContainer">
      <button
        type="button"
        className={`favorite-icon-button ${isLocationFavorite ? 'favorited' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={
          isLocationFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`
        }
      >
        <FontAwesomeIcon icon={isLocationFavorite ? solidHeart : regularHeart} />
      </button>
      <div className="mainFlagContainer">
        <div className="flex-column flagContainer">
          <img src={flag} alt={`${name} flag`} className="m-2 img" loading="lazy" />
          <p className="Flagname">{name}</p>
          <p className="populationTotal">Population: {formattedPopulation}</p>

          <button
            key={id}
            type="button"
            className="flagButton"
            onClick={handlePollutionClick}
            aria-label={`View air quality data for ${name}`}
          >
            <NavLink to="/pollution" className="link m-2 text-light">
              <FontAwesomeIcon icon={faCircleArrowRight} className="icon" />
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
});

Country.displayName = 'Country';

Country.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  flag: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  population: PropTypes.number.isRequired,
  region: PropTypes.string.isRequired,
};

export default Country;
