import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Navbar/Navbar';
import Pollution from '../Details/Pollution';
import { usePollutionStore } from '../../store/useAppStore';
import './Pollution.css';
import '../common/States.css';

const Pollutions: React.FC = () => {
  const { pollutionData: pollutions, loading, error } = usePollutionStore();

  if (loading) {
    return (
      <div>
        <Header id="/countries" />
        <div className="loading-container">
          <p>Loading pollution data, please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header id="/countries" />
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <NavLink to="/countries" className="back-link">
            Go back to countries
          </NavLink>
        </div>
      </div>
    );
  }

  if (!pollutions || pollutions.length === 0) {
    return (
      <div>
        <Header id="/countries" />
        <div className="empty-container">
          <p>No pollution data available. Please select a country.</p>
          <NavLink to="/countries" className="back-link">
            Go back to countries
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header id="/countries" />
      <div className="pollutionContainer">
        {pollutions.map((pollution) => (
          <Pollution key={pollution.id} pollution={pollution} />
        ))}
      </div>
    </div>
  );
};

export default Pollutions;
