import React from 'react';
import PropTypes from 'prop-types';

/**
 * RegionHeader component displaying region name and map
 * @param {string} regionName - Name of the region
 * @param {string} regionImage - URL of the region map image
 */
const RegionHeader = React.memo(({ regionName, regionImage }) => (
  <div>
    <h3>{regionName}</h3>
    <img src={regionImage} alt={`${regionName} map`} className="img1" loading="lazy" />
  </div>
));

RegionHeader.propTypes = {
  regionName: PropTypes.string.isRequired,
  regionImage: PropTypes.string.isRequired,
};

RegionHeader.displayName = 'RegionHeader';

export default RegionHeader;
