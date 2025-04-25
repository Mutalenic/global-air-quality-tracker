import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';
import './InteractiveWorldMap.css';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// Define mock air quality data for visualization purposes
// In a real app this would come from your API/Redux store
const mockAirQualityData = [
  { name: "United States", coordinates: [-95.7129, 37.0902], value: 35 },
  { name: "Brazil", coordinates: [-47.9292, -15.7801], value: 58 },
  { name: "China", coordinates: [104.1954, 35.8617], value: 85 },
  { name: "India", coordinates: [78.9629, 20.5937], value: 92 },
  { name: "United Kingdom", coordinates: [-3.4360, 55.3781], value: 45 },
  { name: "South Africa", coordinates: [22.9375, -30.5595], value: 62 },
  { name: "Australia", coordinates: [133.7751, -25.2744], value: 28 },
  { name: "Russia", coordinates: [105.3188, 61.5240], value: 57 },
  { name: "Japan", coordinates: [138.2529, 36.2048], value: 42 },
  { name: "Egypt", coordinates: [30.8025, 26.8206], value: 78 },
];

// AQI color scale
const colorScale = scaleLinear()
  .domain([0, 50, 100, 150, 200, 300])
  .range([
    "#009966", // Good
    "#FFDE33", // Moderate
    "#FF9933", // Unhealthy for sensitive groups
    "#CC0033", // Unhealthy
    "#660099", // Very unhealthy
    "#7E0023", // Hazardous
  ]);

const InteractiveWorldMap = ({ onRegionClick }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setPosition({ coordinates: [0, 0], zoom: window.innerWidth < 768 ? 0.8 : 1 });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMoveEnd = (position) => {
    setPosition(position);
  };
  
  const handleRegionClick = (geo) => {
    if (onRegionClick) {
      onRegionClick(geo.properties.name);
    }
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (geo) => {
    setTooltipContent(geo.properties.name);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="interactive-map-container" onMouseMove={handleMouseMove}>
      {showTooltip && (
        <div
          className="map-tooltip"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}
      <ComposableMap
        projectionConfig={{
          scale: 147,
        }}
        className="world-map-svg"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          maxZoom={5}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                  onClick={() => handleRegionClick(geo)}
                  onMouseEnter={() => handleMouseEnter(geo)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: "#EAEAEC",
                      outline: "none",
                      stroke: "#D6D6DA",
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: "#009688",
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 250ms",
                    },
                    pressed: {
                      fill: "#006C60",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          
          {/* Air Quality Markers */}
          {mockAirQualityData.map((city, index) => (
            <Marker key={index} coordinates={city.coordinates}>
              <circle
                r={city.value / 15}
                fill={colorScale(city.value)}
                stroke="#FFFFFF"
                strokeWidth={1}
                opacity={0.8}
                className="city-marker"
              />
            </Marker>
          ))}
          
          {/* Major annotations */}
          <Annotation
            subject={[78.9629, 20.5937]} // India
            dx={-30}
            dy={-30}
            connectorProps={{
              stroke: "#009688",
              strokeWidth: 1.5,
              strokeLinecap: "round",
            }}
          >
            <text
              x={4}
              y={-4}
              fill="#009688"
              textAnchor="end"
              alignmentBaseline="middle"
              className="annotation-text"
              fontSize={14}
            >
              India
            </text>
          </Annotation>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Legend */}
      <div className="map-legend">
        <h4>Air Quality Index (AQI)</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#009966" }}></span>
            <span>Good (0-50)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#FFDE33" }}></span>
            <span>Moderate (51-100)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#FF9933" }}></span>
            <span>Unhealthy for sensitive groups (101-150)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#CC0033" }}></span>
            <span>Unhealthy (151-200)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#660099" }}></span>
            <span>Very unhealthy (201-300)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#7E0023" }}></span>
            <span>Hazardous (300+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

InteractiveWorldMap.propTypes = {
  onRegionClick: PropTypes.func,
};

InteractiveWorldMap.defaultProps = {
  onRegionClick: null,
};

export default InteractiveWorldMap;