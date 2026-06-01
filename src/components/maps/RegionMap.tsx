import React, { useEffect, useState } from 'react';
import InteractiveMap from './InteractiveMap';
import { useCountriesStore } from '../../store/useAppStore';
import { Card } from '../ui';
import { cn } from '../../utils/cn';

interface RegionMapProps {
  className?: string;
  onLocationSelect?: (country: any) => void;
}

const RegionMap: React.FC<RegionMapProps> = ({ className, onLocationSelect }) => {
  const { countries, loading, error, selectedRegion } = useCountriesStore();
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);

  useEffect(() => {
    if (!countries.length) return;

    const markers = countries.map((country) => ({
      id: country.cca2,
      coordinates: country.latlng.length >= 2 ? [country.latlng[1], country.latlng[0]] : [0, 0],
      title: country.name.common,
      country: country.name.common,
      flag: country.flags.png,
      aqi: undefined, // Will be populated when pollution data is available
      description: `${country.subregion || country.region} • Population: ${(country.population / 1000000).toFixed(1)}M`,
      data: country,
    }));

    setMapMarkers(markers);
  }, [countries]);

  const handleMarkerClick = (marker: any) => {
    onLocationSelect?.(marker.data);
  };

  const mapClasses = cn(
    'w-full h-96 md:h-[500px]',
    className
  );

  if (loading) {
    return (
      <Card className={mapClasses}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={mapClasses}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading map</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!countries.length) {
    return (
      <Card className={mapClasses}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No countries available</p>
            <p className="text-sm text-gray-500">Please select a region to view countries</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={mapClasses} padding="none">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedRegion || 'World'} Map
        </h3>
        <p className="text-sm text-gray-600">
          {countries.length} countries • Click on any location for details
        </p>
      </div>
      <div className="h-[calc(100%-5rem)]">
        <InteractiveMap
          markers={mapMarkers}
          center={selectedRegion === 'Europe' ? [10, 50] : selectedRegion === 'Asia' ? [100, 30] : [0, 20]}
          zoom={selectedRegion ? 3 : 2}
          onMarkerClick={handleMarkerClick}
          showAQILayer={false}
          className="h-full"
        />
      </div>
    </Card>
  );
};

export default RegionMap;
