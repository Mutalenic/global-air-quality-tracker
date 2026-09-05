import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Cloud, Factory, Flame, Car } from 'lucide-react';
import { PollutionData } from '../../store/useAppStore';
import { AQIBadge } from '../common/AQIBadge';
import './Pollution.css';

interface PollutionProps {
  pollution: PollutionData;
}

const Pollution: React.FC<PollutionProps> = ({ pollution }) => {
  const { city, flag, aqi, pm25, pm10, o3, no2, so2, co } = pollution;

  const pollutants = [
    { icon: Droplets, label: 'PM2.5', value: pm25, desc: 'Fine particles' },
    { icon: Wind, label: 'PM10', value: pm10, desc: 'Coarse particles' },
    { icon: Cloud, label: 'O₃', value: o3, desc: 'Ozone' },
    { icon: Car, label: 'NO₂', value: no2, desc: 'Nitrogen dioxide' },
    { icon: Factory, label: 'SO₂', value: so2, desc: 'Sulfur dioxide' },
    { icon: Flame, label: 'CO', value: co, desc: 'Carbon monoxide' },
  ];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Header with Flag and City */}
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-teal-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">{city}</h3>
            <p className="text-white/80 text-sm">Air Quality Monitor</p>
          </div>
          <img
            src={flag}
            alt={`${city} flag`}
            className="w-16 h-12 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* AQI Badge */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <AQIBadge aqi={aqi} size="lg" showHealthAdvice={false} />
      </div>

      {/* Pollutants Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {pollutants.map((pollutant, index) => {
          const Icon = pollutant.icon;
          return (
            <motion.div
              key={pollutant.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{pollutant.desc}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {pollutant.label}: {pollutant.value} µg/m³
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Pollution;
