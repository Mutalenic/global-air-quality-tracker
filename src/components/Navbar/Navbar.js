import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();
  const isPollutionPage = location.pathname.includes('pollution');

  return (
    <div className="shadow-lg">
      <nav>
        <div className="navBarContainer">
          {isPollutionPage && (
            <button
              type="button"
              className="btn backButton"
            >
              <NavLink to="/countries" className="link text-light">
                <FontAwesomeIcon icon={faArrowLeft} className="icon smallIcon" />
              </NavLink>
            </button>
          )}
          <button
            type="button"
            className="btn"
          >
            <NavLink to="/" className="link text-light">
              {/* Updated to redirect to home */}
              <FontAwesomeIcon icon={faHome} className="icon" />
            </NavLink>
          </button>
          <h1 className="header">Air Quality</h1>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
