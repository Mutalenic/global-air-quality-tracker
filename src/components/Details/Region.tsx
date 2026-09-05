import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Africa from '../Maps/Africa.png';
import Antarctic from '../Maps/Antarctica.png';
import Asia from '../Maps/Asia.png';
import Europe from '../Maps/Europe.png';
import America from '../Maps/America.png';
import Oceania from '../Maps/Oceania.png';
import { useCountriesStore } from '../../store/useAppStore';
import './Region.css';

// Map region names to images for better performance
const regionImageMap: Record<string, string> = {
  Africa,
  Asia,
  Europe,
  Oceania,
  America,
  Americas: America, // Handle both 'America' and 'Americas'
  Antarctic,
};

interface RegionProps {
  region: string;
  regionCountry: number;
}

const Region: React.FC<RegionProps> = React.memo(({ region, regionCountry }) => {
  const navigate = useNavigate();
  const { fetchCountries } = useCountriesStore();

  // Memoize the region image to avoid recalculation
  const regionImage = useMemo(() => regionImageMap[region] || Antarctic, [region]);

  // Memoize the click handler - fetch countries then navigate.
  // The Countries component subscribes to the store's loading state,
  // so it will show a loading skeleton while data is being fetched.
  const handleRegionClick = useCallback(async () => {
    await fetchCountries(region);
    navigate('/countries');
  }, [fetchCountries, region, navigate]);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={handleRegionClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Card Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        {/* Region Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-full aspect-[4/3] mb-4 rounded-xl overflow-hidden"
        >
          <img
            src={regionImage}
            alt={`${region} map`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{regionCountry} Countries</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {region}
          </h3>

          {/* Action Button */}
          <motion.button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            aria-label={`View countries in ${region}`}
          >
            Explore Region
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

Region.displayName = 'Region';

export default Region;
