import React, { useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Africa from '../Maps/Africa.png';
import Antarctic from '../Maps/Antarctica.png';
import Asia from '../Maps/Asia.png';
import Europe from '../Maps/Europe.png';
import America from '../Maps/America.png';
import Oceania from '../Maps/Oceania.png';
import { useCountriesStore } from '../../store/useAppStore';
import './Region.css';

// Map region names to images for better performance
const regionImageMap: Record<string, string> = {
  Africa,
  Asia,
  Europe,
  Oceania,
  America,
  Americas: America, // Handle both 'America' and 'Americas'
  Antarctic,
};

interface RegionProps {
  region: string;
  regionCountry: number;
}

const Region: React.FC<RegionProps> = React.memo(({ region, regionCountry }) => {
  const navigate = useNavigate();
  const { fetchCountries } = useCountriesStore();

  // Memoize the region image to avoid recalculation
  const regionImage = useMemo(() => regionImageMap[region] || Antarctic, [region]);

  // Memoize the click handler - fetch countries then navigate after a brief delay
  const handleRegionClick = useCallback(async () => {
    await fetchCountries(region);
    // Increased delay to ensure state updates before navigation
    setTimeout(() => {
      navigate('/countries');
    }, 100); // Increased from 50ms to 100ms for better reliability
  }, [fetchCountries, region, navigate]);

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
