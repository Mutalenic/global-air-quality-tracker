import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useFavorites } from '../../hooks';
import Navbar from '../Navbar/Navbar';
import './Favorites.css';

const Favorites = () => {
  const { favorites, removeFavorite, clearFavorites, hasFavorites } = useFavorites();

  const handleRemove = (id) => {
    removeFavorite(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      clearFavorites();
    }
  };

  return (
    <div>
      <Navbar id="/" />
      <div className="favorites-container">
        <div className="favorites-header">
          <h2>
            <FontAwesomeIcon icon={faHeart} className="heart-icon" />
            My Favorite Locations
          </h2>
          {hasFavorites && (
            <button
              type="button"
              className="clear-all-button"
              onClick={handleClearAll}
              aria-label="Clear all favorites"
            >
              <FontAwesomeIcon icon={faTrash} /> Clear All
            </button>
          )}
        </div>

        {!hasFavorites ? (
          <div className="empty-favorites">
            <FontAwesomeIcon icon={faHeart} className="empty-icon" />
            <p>No favorite locations yet</p>
            <p className="empty-subtitle">
              Click the heart icon on any country to add it to your favorites
            </p>
            <NavLink to="/" className="back-link">
              Explore Regions
            </NavLink>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((location) => (
              <div key={location.id} className="favorite-card">
                <div className="favorite-card-header">
                  <img
                    src={location.flag}
                    alt={`${location.name} flag`}
                    className="favorite-flag"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="remove-favorite-button"
                    onClick={() => handleRemove(location.id)}
                    aria-label={`Remove ${location.name} from favorites`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="favorite-card-body">
                  <h3>{location.name}</h3>
                  <p className="favorite-region">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {location.region}
                  </p>
                  <p className="favorite-population">
                    Population: {location.population?.toLocaleString() || 'N/A'}
                  </p>
                  <NavLink
                    to="/pollution"
                    state={{
                      lati: location.lat,
                      long: location.lng,
                      flag: location.flag,
                      name: location.name,
                    }}
                    className="view-pollution-link"
                  >
                    View Air Quality
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
