import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card } from '../ui';
import { cn } from '../../utils/cn';

interface PollutantData {
  pollutant: string;
  value: number;
  max: number;
  unit: string;
}

interface PollutantRadarChartProps {
  data: PollutantData[];
  className?: string;
  height?: number;
  showLegend?: boolean;
}

const PollutantRadarChart: React.FC<PollutantRadarChartProps> = ({
  data,
  className,
  height = 300,
  showLegend = true,
}) => {
  const getHealthStatus = (pollutant: string, value: number) => {
    const thresholds: Record<string, { good: number; moderate: number; unhealthy: number }> = {
      pm25: { good: 12, moderate: 35, unhealthy: 55 },
      pm10: { good: 54, moderate: 154, unhealthy: 254 },
      o3: { good: 54, moderate: 70, unhealthy: 85 },
      no2: { good: 53, moderate: 100, unhealthy: 360 },
      so2: { good: 35, moderate: 75, unhealthy: 185 },
      co: { good: 4, moderate: 9, unhealthy: 12 },
    };

    const threshold = thresholds[pollutant.toLowerCase()];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.moderate) return 'moderate';
    if (value <= threshold.unhealthy) return 'unhealthy';
    return 'hazardous';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good': return '#00e400';
      case 'moderate': return '#ffff00';
      case 'unhealthy': return '#ff7e00';
      case 'hazardous': return '#ff0000';
      default: return '#6b7280';
    }
  };

  const processedData = data.map(item => ({
    ...item,
    percentage: (item.value / item.max) * 100,
    healthStatus: getHealthStatus(item.pollutant, item.value),
    healthColor: getHealthColor(getHealthStatus(item.pollutant, item.value)),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{data.pollutant}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Value:</span>
              <span className="font-medium">{data.value} {data.unit}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Status:</span>
              <span
                className="font-medium"
                style={{ color: data.healthColor }}
              >
                {data.healthStatus}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Percentage:</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
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
          Pollutant Analysis
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive air quality breakdown
        </p>
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <PolarGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="pollutant"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Radar
              name="Pollutant Levels"
              dataKey="percentage"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        {showLegend && (
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Hazardous</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PollutantRadarChart;
