import React, { useEffect, useState } from 'react';
import InteractiveMap from './InteractiveMap';
import { usePollutionStore } from '../../store/useAppStore';
import { Card } from '../ui';
import { cn } from '../../utils/cn';

interface AQIMapProps {
  className?: string;
  showLegend?: boolean;
}

const AQIMap: React.FC<AQIMapProps> = ({ className, showLegend = true }) => {
  const { pollutionData, loading, error } = usePollutionStore();
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);

  useEffect(() => {
    if (!pollutionData.length) return;

    const markers = pollutionData.map((pollution) => ({
      id: pollution.id,
      coordinates: [pollution.lon, pollution.lat],
      title: pollution.city,
      country: pollution.city,
      flag: pollution.flag,
      aqi: pollution.aqi,
      description: `AQI: ${pollution.aqi} • PM2.5: ${pollution.pm25} µg/m³`,
      data: pollution,
    }));

    setMapMarkers(markers);
  }, [pollutionData]);

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
            <p className="text-gray-600">Loading air quality data...</p>
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
            <p className="text-red-600 mb-2">Error loading air quality data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!pollutionData.length) {
    return (
      <Card className={mapClasses}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No air quality data available</p>
            <p className="text-sm text-gray-500">Please select a location to view air quality</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={mapClasses} padding="none">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Global Air Quality Map
        </h3>
        <p className="text-sm text-gray-600">
          {pollutionData.length} locations • Real-time air quality monitoring
        </p>
      </div>
      <div className="h-[calc(100%-5rem)]">
        <InteractiveMap
          markers={mapMarkers}
          center={mapMarkers.length > 0 ? mapMarkers[0].coordinates : [0, 20]}
          zoom={4}
          showAQILayer={true}
          className="h-full"
        />
      </div>
      {showLegend && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Air Quality Index</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Good (0-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Moderate (51-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Unhealthy for Sensitive (101-150)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Unhealthy (151-200)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-600">Very Unhealthy (201-300)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-900"></div>
              <span className="text-xs text-gray-600">Hazardous (301+)</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AQIMap;
