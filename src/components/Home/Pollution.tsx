import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import Header from '../Navbar/Navbar';
import Pollution from '../Details/Pollution';
import { HealthRecommendations } from '../common/HealthRecommendations';
import { usePollutionStore } from '../../store/useAppStore';
import './Pollution.css';
import '../common/States.css';

const Pollutions: React.FC = () => {
  const { pollutionData: pollutions, loading, error } = usePollutionStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Loading pollution data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error Loading Data</h2>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <NavLink
              to="/countries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to countries
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  if (!pollutions || pollutions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center max-w-md shadow-lg">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              No pollution data available. Please select a country first.
            </p>
            <NavLink
              to="/countries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to countries
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  // Calculate average AQI for health recommendations
  const averageAQI = pollutions.length > 0
    ? Math.round(pollutions.reduce((sum, p) => sum + p.aqi, 0) / pollutions.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <NavLink
            to="/countries"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to countries
          </NavLink>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Air Quality Data
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {pollutions.length} location{pollutions.length !== 1 ? 's' : ''} monitored
          </p>
        </motion.div>

        {/* Health Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <HealthRecommendations aqi={averageAQI} />
        </motion.div>

        {/* Pollution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pollutions.map((pollution, index) => (
            <motion.div
              key={pollution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Pollution pollution={pollution} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pollutions;
