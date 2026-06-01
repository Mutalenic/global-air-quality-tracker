import React from 'react';
import { cn } from '../../utils/cn';

interface AQIIndicatorProps {
  aqi: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const AQIIndicator: React.FC<AQIIndicatorProps> = ({
  aqi,
  size = 'md',
  showLabel = true,
  className
}) => {
  const getAQILevel = (value: number) => {
    if (value <= 50) return { level: 'Good', class: 'aqi-good', color: 'bg-air-good' };
    if (value <= 100) return { level: 'Moderate', class: 'aqi-moderate', color: 'bg-air-moderate' };
    if (value <= 150) return { level: 'Unhealthy for Sensitive', class: 'aqi-unhealthy-sensitive', color: 'bg-air-unhealthy-sensitive' };
    if (value <= 200) return { level: 'Unhealthy', class: 'aqi-unhealthy', color: 'bg-air-unhealthy' };
    if (value <= 300) return { level: 'Very Unhealthy', class: 'aqi-very-unhealthy', color: 'bg-air-very-unhealthy' };
    return { level: 'Hazardous', class: 'aqi-hazardous', color: 'bg-air-hazardous' };
  };

  const { level, class: levelClass, color } = getAQILevel(aqi);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const indicatorClasses = cn(
    'inline-flex items-center justify-center rounded-full font-medium',
    color,
    sizeClasses[size],
    levelClass,
    className
  );

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={indicatorClasses}>
        {showLabel && (
          <span className="text-white">
            AQI: {aqi}
          </span>
        )}
        {!showLabel && (
          <span className="text-white font-bold">
            {aqi}
          </span>
        )}
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600 mt-1">
          {level}
        </span>
      )}
    </div>
  );
};

export default AQIIndicator;
