import React from 'react';
import { motion } from 'framer-motion';
import {
  Wind,
  Home,
  Car,
  TreePine,
  Dumbbell,
  AlertTriangle,
  CheckCircle,
  Users,
  Baby,
  Heart,
} from 'lucide-react';
import { getAQIColor } from './AQIBadge';

interface HealthRecommendationsProps {
  aqi: number;
}

interface Recommendation {
  icon: React.ElementType;
  title: string;
  description: string;
  type: 'good' | 'caution' | 'warning';
}

const getRecommendations = (aqi: number): Recommendation[] => {
  const baseRecommendations: Recommendation[] = [
    {
      icon: Home,
      title: 'Indoor Air',
      description: 'Keep windows closed and use air purifiers if available.',
      type: aqi > 100 ? 'warning' : 'good',
    },
    {
      icon: Car,
      title: 'Outdoor Activities',
      description: aqi <= 50
        ? 'Perfect conditions for all outdoor activities.'
        : aqi <= 100
        ? 'Good for most activities. Sensitive individuals should monitor conditions.'
        : aqi <= 150
        ? 'Sensitive groups should reduce prolonged outdoor exertion.'
        : 'Avoid prolonged outdoor exertion. Everyone should take precautions.',
      type: aqi > 100 ? 'warning' : aqi > 50 ? 'caution' : 'good',
    },
    {
      icon: Dumbbell,
      title: 'Exercise',
      description: aqi <= 50
        ? 'Excellent time for outdoor exercise!'
        : aqi <= 100
        ? 'Good for outdoor exercise. Consider indoor options if sensitive.'
        : aqi <= 150
        ? 'Move exercise indoors or to less polluted areas.'
        : 'Avoid outdoor exercise. Choose indoor activities.',
      type: aqi > 150 ? 'warning' : aqi > 50 ? 'caution' : 'good',
    },
    {
      icon: TreePine,
      title: 'Environment',
      description: 'Consider planting air-purifying plants and reducing personal emissions.',
      type: 'good',
    },
  ];

  // Add sensitive groups warning for higher AQI
  if (aqi > 100) {
    baseRecommendations.push({
      icon: Users,
      title: 'Sensitive Groups',
      description: 'Children, elderly, and those with heart/lung conditions should limit outdoor exposure.',
      type: 'warning',
    });
  }

  if (aqi > 150) {
    baseRecommendations.push({
      icon: AlertTriangle,
      title: 'Health Alert',
      description: 'Everyone may experience health effects. Consider staying indoors.',
      type: 'warning',
    });
  }

  return baseRecommendations;
};

const getSensitiveGroups = (aqi: number): string[] => {
  if (aqi <= 50) return [];
  if (aqi <= 100) return ['People with respiratory conditions'];
  if (aqi <= 150) return [
    'Children and teenagers',
    'Elderly (65+)',
    'People with heart disease',
    'People with lung disease (asthma, COPD)',
    'Pregnant women',
  ];
  return [
    'Everyone is at risk',
    'Children and teenagers',
    'Elderly (65+)',
    'People with heart or lung conditions',
    'Pregnant women',
    'Outdoor workers',
  ];
};

export const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({ aqi }) => {
  const recommendations = getRecommendations(aqi);
  const sensitiveGroups = getSensitiveGroups(aqi);
  const aqiColor = getAQIColor(aqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-6 border-b border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: `${aqiColor}15` }}
      >
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6" style={{ color: aqiColor }} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Health Recommendations
          </h3>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Personalized advice based on current air quality conditions
        </p>
      </div>

      {/* Recommendations Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          const isGood = rec.type === 'good';
          const isCaution = rec.type === 'caution';
          const isWarning = rec.type === 'warning';

          return (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${
                isGood
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : isCaution
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isGood
                      ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                      : isCaution
                      ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                </div>
                {isGood ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sensitive Groups */}
      {sensitiveGroups.length > 0 && (
        <div className="px-6 pb-6">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                Who Should Be Cautious?
              </h4>
            </div>
            <ul className="space-y-2">
              {sensitiveGroups.map((group, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200"
                >
                  <Wind className="w-4 h-4" />
                  {group}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};
