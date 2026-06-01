import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card } from '../ui';
import { cn } from '../../utils/cn';

interface AQIDataPoint {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

interface AQITrendChartProps {
  data: AQIDataPoint[];
  className?: string;
  height?: number;
  showLegend?: boolean;
  pollutants?: ('aqi' | 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co')[];
}

const AQITrendChart: React.FC<AQITrendChartProps> = ({
  data,
  className,
  height = 300,
  showLegend = true,
  pollutants = ['aqi', 'pm25', 'pm10'],
}) => {
  const getAQIColor = (value: number) => {
    if (value <= 50) return '#00e400';
    if (value <= 100) return '#ffff00';
    if (value <= 150) return '#ff7e00';
    if (value <= 200) return '#ff0000';
    if (value <= 300) return '#8f3f97';
    return '#7e0023';
  };

  const pollutantConfig = {
    aqi: { color: '#3b82f6', name: 'AQI', strokeWidth: 3 },
    pm25: { color: '#10b981', name: 'PM2.5', strokeWidth: 2 },
    pm10: { color: '#f59e0b', name: 'PM10', strokeWidth: 2 },
    o3: { color: '#8b5cf6', name: 'O3', strokeWidth: 2 },
    no2: { color: '#ef4444', name: 'NO2', strokeWidth: 2 },
    so2: { color: '#6b7280', name: 'SO2', strokeWidth: 2 },
    co: { color: '#06b6d4', name: 'CO', strokeWidth: 2 },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">
                {entry.name}: {entry.value}
                {entry.dataKey === 'aqi' ? '' : ' µg/m³'}
              </span>
            </div>
          ))}
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
          Air Quality Trends
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {data.length} data points • Last 24 hours
        </p>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
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
            {showLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
              />
            )}
            {pollutants.map((pollutant) => {
              const config = pollutantConfig[pollutant];
              return (
                <Area
                  key={pollutant}
                  type="monotone"
                  dataKey={pollutant}
                  stroke={config.color}
                  fill={config.color}
                  fillOpacity={0.3}
                  strokeWidth={config.strokeWidth}
                  name={config.name}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AQITrendChart;
