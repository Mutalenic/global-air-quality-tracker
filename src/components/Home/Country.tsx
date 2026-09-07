import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { usePollutionStore } from '../../store/useAppStore';
import { useFavorites } from '../../hooks';
import { showSuccessToast } from '../../utils/toastUtils';
import './Country.css';

interface CountryProps {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  flag: string;
  region: string;
}

const Country: React.FC<CountryProps> = React.memo(
  ({ id, name, lat, lng, population, flag, region }) => {
    const fetchPollution = usePollutionStore((state) => state.fetchPollution);
    const { isFavorite, toggleFavorite } = useFavorites();

    const handlePollutionClick = useCallback(() => {
      fetchPollution(lat, lng, name, flag);
    }, [fetchPollution, lat, lng, flag, name]);

    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const wasFavorite = isFavorite(id);
        const location = { id, name, lat, lng, population, flag, region };
        toggleFavorite(location);
        showSuccessToast(
          wasFavorite ? `Removed ${name} from favorites` : `Added ${name} to favorites`,
          { autoClose: 2000 },
        );
      },
      [id, name, lat, lng, population, flag, region, toggleFavorite, isFavorite],
    );

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
            <NavLink
              to="/pollution"
              className="link m-2 text-light flagButton"
              onClick={handlePollutionClick}
              aria-label={`View air quality data for ${name}`}
            >
              <FontAwesomeIcon icon={faCircleArrowRight} className="icon" />
            </NavLink>
          </div>
        </div>
      </div>
    );
  },
);

Country.displayName = 'Country';

export default Country;
