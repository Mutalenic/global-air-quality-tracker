import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../../hooks';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { favoritesCount } = useFavorites();
  const isPollutionPage = location.pathname.includes('pollution');

  return (
    <div className="shadow-lg">
      <nav>
        <div className="navBarContainer">
          {isPollutionPage && (
            <button type="button" className="btn backButton">
              <NavLink to="/countries" className="link text-light">
                <FontAwesomeIcon icon={faArrowLeft} className="icon smallIcon" />
              </NavLink>
            </button>
          )}
          <button type="button" className="btn">
            <NavLink to="/" className="link text-light">
              <FontAwesomeIcon icon={faHome} className="icon" />
            </NavLink>
          </button>
          <h1 className="header">Air Quality</h1>
          <button type="button" className="btn favorites-btn">
            <NavLink to="/favorites" className="link text-light favorites-link">
              <FontAwesomeIcon icon={faHeart} className="icon" />
              {favoritesCount > 0 && <span className="favorites-badge">{favoritesCount}</span>}
            </NavLink>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
