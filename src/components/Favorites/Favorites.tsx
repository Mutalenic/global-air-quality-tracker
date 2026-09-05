import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks';
import { usePollutionStore } from '../../store/useAppStore';
import { showErrorToast } from '../../utils/toastUtils';
import Navbar from '../Navbar/Navbar';
import './Favorites.css';

const Favorites: React.FC = () => {
  const { favorites, removeFavorite, clearFavorites, hasFavorites } = useFavorites();
  const fetchPollution = usePollutionStore((state) => state.fetchPollution);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleRemove = useCallback((id: string) => {
    removeFavorite(id);
  }, [removeFavorite]);

  const handleClearAll = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmClear = useCallback(() => {
    clearFavorites();
    setShowConfirmDialog(false);
  }, [clearFavorites]);

  const handleCancelClear = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const handleViewAirQuality = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>, location: typeof favorites[number]) => {
      e.preventDefault();
      try {
        await fetchPollution(location.lat, location.lng, location.name, location.flag);
        navigate('/pollution');
      } catch {
        showErrorToast('Failed to load air quality data');
      }
    },
    [fetchPollution, navigate],
  );

  return (
    <div>
      <Navbar />
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
                    onClick={(e) => handleViewAirQuality(e, location)}
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            // Only close if clicking on the overlay itself, not on content
            if (e.target === e.currentTarget) {
              handleCancelClear();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleCancelClear();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close confirmation dialog"
        >
          <div className="modal-content" role="dialog" aria-labelledby="confirm-title">
            <h3 id="confirm-title">Confirm Action</h3>
            <p>Are you sure you want to remove all favorites? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCancelClear();
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleConfirmClear();
                  }
                }}
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
