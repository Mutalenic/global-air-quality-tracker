import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { cn } from '../../utils/cn';

// Set Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

interface MapMarker {
  id: string;
  coordinates: [number, number];
  title: string;
  description?: string;
  aqi?: number;
  country: string;
  flag: string;
}

interface InteractiveMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  showAQILayer?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  markers = [],
  center = [0, 20],
  zoom = 2,
  className,
  onMarkerClick,
  showAQILayer = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution control
    map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    const existingMarkers = document.getElementsByClassName('mapboxgl-marker');
    while (existingMarkers.length > 0) {
      existingMarkers[0].remove();
    }

    // Add AQI layer if enabled
    if (showAQILayer) {
      if (!map.current.getLayer('aqi-layer')) {
        map.current.addLayer({
          id: 'aqi-layer',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: markers.map(marker => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: marker.coordinates,
                },
                properties: {
                  id: marker.id,
                  aqi: marker.aqi || 0,
                },
              })),
            },
          },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'aqi'],
              0, 4,
              50, 6,
              100, 8,
              150, 10,
              200, 12,
              300, 14,
            ],
            'circle-color': [
              'case',
              ['<=', ['get', 'aqi'], 50], '#00e400',
              ['<=', ['get', 'aqi'], 100], '#ffff00',
              ['<=', ['get', 'aqi'], 150], '#ff7e00',
              ['<=', ['get', 'aqi'], 200], '#ff0000',
              ['<=', ['get', 'aqi'], 300], '#8f3f97',
              '#7e0023',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.8,
          },
        });
      }
    }

    // Add custom markers
    markers.forEach((marker) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="relative group cursor-pointer">
          <div class="absolute -inset-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div class="relative bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
            <img src="${marker.flag}" alt="${marker.country}" class="w-6 h-6 rounded-full" />
            ${marker.aqi !== undefined ? `
              <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center
                ${marker.aqi <= 50 ? 'bg-green-500' : ''}
                ${marker.aqi > 50 && marker.aqi <= 100 ? 'bg-yellow-500' : ''}
                ${marker.aqi > 100 && marker.aqi <= 150 ? 'bg-orange-500' : ''}
                ${marker.aqi > 150 && marker.aqi <= 200 ? 'bg-red-500' : ''}
                ${marker.aqi > 200 && marker.aqi <= 300 ? 'bg-purple-500' : ''}
                ${marker.aqi > 300 ? 'bg-red-900' : ''}
              ">
                ${marker.aqi}
              </div>
            ` : ''}
          </div>
        </div>
      `;

      markerElement.addEventListener('click', () => {
        onMarkerClick?.(marker);
      });

      new mapboxgl.Marker(markerElement)
        .setLngLat(marker.coordinates)
        .addTo(map.current!);
    });
  }, [markers, mapLoaded, onMarkerClick, showAQILayer]);

  const mapClasses = cn(
    'w-full h-full rounded-lg overflow-hidden',
    className
  );

  return (
    <div className={mapClasses}>
      {!mapboxgl.accessToken && (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center p-6">
            <p className="text-gray-600 mb-2">Mapbox access token is required</p>
            <p className="text-sm text-gray-500">Please add REACT_APP_MAPBOX_ACCESS_TOKEN to your environment variables</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default InteractiveMap;
