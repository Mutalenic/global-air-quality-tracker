import React from 'react';
import { motion } from 'framer-motion';
import Header from '../Navbar/Navbar';
import Region from '../Details/Region';
import { StaggerContainer, StaggerItem } from '../common/PageTransition';
import './Region.css';

interface RegionData {
  region: string;
  country: number;
}

const Regions: React.FC = () => {
  const regionList: RegionData[] = [
    { region: 'Africa', country: 59 },
    { region: 'Americas', country: 56 },
    { region: 'Europe', country: 53 },
    { region: 'Asia', country: 50 },
    { region: 'Oceania', country: 27 },
    { region: 'Antarctic', country: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300"
          >
            Global Air Quality Tracker
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-xl text-gray-600 dark:text-gray-300"
          >
            Real-time air pollution data for countries worldwide
          </motion.p>
        </div>
      </motion.section>

      {/* Regions Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8"
          >
            Select a Region
          </motion.h2>

          <StaggerContainer staggerDelay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionList.map((element) => (
                <StaggerItem key={element.region}>
                  <Region region={element.region} regionCountry={element.country} />
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
};

export default Regions;
