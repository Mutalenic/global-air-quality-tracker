import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Wind } from 'lucide-react';

interface AQIBadgeProps {
  aqi: number;
  size?: 'sm' | 'md' | 'lg';
  showHealthAdvice?: boolean;
}

const getAQIInfo = (aqi: number) => {
  if (aqi <= 50) return {
    label: 'Good',
    color: 'bg-air-good',
    textColor: 'text-gray-900',
    icon: CheckCircle,
    advice: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    healthImplications: 'Enjoy your usual outdoor activities.',
  };
  if (aqi <= 100) return {
    label: 'Moderate',
    color: 'bg-air-moderate',
    textColor: 'text-gray-900',
    icon: Wind,
    advice: 'Air quality is acceptable. However, there may be a risk for some people.',
    healthImplications: 'Sensitive individuals should consider limiting prolonged outdoor exertion.',
  };
  if (aqi <= 150) return {
    label: 'Unhealthy for Sensitive',
    color: 'bg-air-unhealthy-sensitive',
    textColor: 'text-white',
    icon: AlertTriangle,
    advice: 'Members of sensitive groups may experience health effects.',
    healthImplications: 'People with heart or lung disease, older adults, and children should reduce prolonged or heavy exertion.',
  };
  if (aqi <= 200) return {
    label: 'Unhealthy',
    color: 'bg-air-unhealthy',
    textColor: 'text-white',
    icon: AlertTriangle,
    advice: 'Everyone may begin to experience health effects.',
    healthImplications: 'Avoid prolonged outdoor exertion. Everyone should take precautions.',
  };
  if (aqi <= 300) return {
    label: 'Very Unhealthy',
    color: 'bg-air-very-unhealthy',
    textColor: 'text-white',
    icon: AlertTriangle,
    advice: 'Health warnings of emergency conditions.',
    healthImplications: 'Avoid all outdoor activities. Stay indoors and use air purifiers if available.',
  };
  return {
    label: 'Hazardous',
    color: 'bg-air-hazardous',
    textColor: 'text-white',
    icon: AlertTriangle,
    advice: 'Health alert: everyone may experience more serious health effects.',
    healthImplications: 'Emergency conditions. Remain indoors and avoid physical exertion.',
  };
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const AQIBadge: React.FC<AQIBadgeProps> = ({
  aqi,
  size = 'md',
  showHealthAdvice = false,
}) => {
  const info = getAQIInfo(aqi);
  const Icon = info.icon;

  return (
    <div className="space-y-2">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${info.color} ${info.textColor} ${sizeClasses[size]}`}
      >
        <Icon className="w-4 h-4" />
        <span>AQI {aqi}</span>
        <span className="opacity-90">- {info.label}</span>
      </motion.div>

      {showHealthAdvice && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-3 space-y-2"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">{info.advice}</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{info.healthImplications}</p>
        </motion.div>
      )}
    </div>
  );
};

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 150) return '#ff7e00';
  if (aqi <= 200) return '#ff0000';
  if (aqi <= 300) return '#8f3f97';
  return '#7e0023';
};
