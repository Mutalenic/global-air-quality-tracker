import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, AQIIndicator } from '../ui';
import { cn } from '../../utils/cn';

interface RegionalData {
  region: string;
  aqi: number;
  pm25: number;
  pm10: number;
  population: number;
  countryCount: number;
}

interface RegionalComparisonChartProps {
  data: RegionalData[];
  className?: string;
  height?: number;
  metric?: 'aqi' | 'pm25' | 'pm10' | 'population';
}

const RegionalComparisonChart: React.FC<RegionalComparisonChartProps> = ({
  data,
  className,
  height = 300,
  metric = 'aqi',
}) => {
  const getMetricConfig = (metricType: string) => {
    switch (metricType) {
      case 'aqi':
        return { color: '#3b82f6', name: 'AQI', unit: '' };
      case 'pm25':
        return { color: '#10b981', name: 'PM2.5', unit: ' µg/m³' };
      case 'pm10':
        return { color: '#f59e0b', name: 'PM10', unit: ' µg/m³' };
      case 'population':
        return { color: '#8b5cf6', name: 'Population', unit: 'M' };
      default:
        return { color: '#6b7280', name: metricType, unit: '' };
    }
  };

  const config = getMetricConfig(metric);
  const processedData = data.map(item => ({
    ...item,
    displayValue: metric === 'population' ? (item.population / 1000000).toFixed(1) : item[metric],
  }));

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  };

  const getBarColor = (value: number) => {
    if (metric === 'aqi') return getAQIColor(value);
    if (metric === 'pm25') {
      if (value <= 12) return '#00e400';
      if (value <= 35) return '#ffff00';
      if (value <= 55) return '#ff7e00';
      return '#ff0000';
    }
    if (metric === 'pm10') {
      if (value <= 54) return '#00e400';
      if (value <= 154) return '#ffff00';
      if (value <= 254) return '#ff7e00';
      return '#ff0000';
    }
    return config.color;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">{config.name}:</span>
              <span className="font-medium">{data.displayValue}{config.unit}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Countries:</span>
              <span className="font-medium">{data.countryCount}</span>
            </div>
            {metric === 'aqi' && (
              <div className="mt-2">
                <AQIIndicator aqi={data.aqi} size="sm" showLabel={false} />
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const chartClasses = cn(
    'w-full',
    className
  );

  return (
    <Card className={chartClasses}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Regional Comparison
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {config.name} by region • {data.length} regions
        </p>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={processedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="region"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="displayValue" name={config.name} radius={[4, 4, 0, 0]}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry[metric])} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {metric === 'aqi' && (
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
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
              <span className="text-xs text-gray-600">Unhealthy (151+)</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RegionalComparisonChart;
