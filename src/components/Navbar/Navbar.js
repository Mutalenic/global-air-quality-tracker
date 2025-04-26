import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faArrowLeft, 
  faCloud, 
  faGlobe, 
  faChartLine,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isPollutionPage = location.pathname.includes('pollution');

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="main-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            {isPollutionPage && (
              <button
                type="button"
                className="nav-btn back-button"
                aria-label="Go back"
              >
                <NavLink to="/countries" className="nav-link">
                  <FontAwesomeIcon icon={faArrowLeft} className="nav-icon small-icon" />
                </NavLink>
              </button>
            )}
            <NavLink to="/" className="brand-link">
              <FontAwesomeIcon icon={faGlobe} className="brand-icon" />
              <span className="brand-text">Air Quality Tracker</span>
            </NavLink>
          </div>

          {/* Mobile menu toggle button */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}>
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </button>

          {/* Navigation Links */}
          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/countries" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FontAwesomeIcon icon={faGlobe} className="nav-icon" />
              <span>Countries</span>
            </NavLink>
            <NavLink to="/pollution" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
              <span>Pollution</span>
            </NavLink>
            <NavLink to="/weather" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FontAwesomeIcon icon={faCloud} className="nav-icon" />
              <span>Weather</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
