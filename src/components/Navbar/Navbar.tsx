import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Heart, Sun, Moon } from 'lucide-react';
import { useFavorites } from '../../hooks';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { favoritesCount } = useFavorites();
  const { isDark, toggleTheme } = useTheme();
  const isPollutionPage = location.pathname.includes('pollution');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-2">
            {isPollutionPage && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <NavLink to="/countries" className="flex items-center">
                  <ArrowLeft className="w-5 h-5" />
                </NavLink>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <NavLink to="/" className="flex items-center">
                <Home className="w-5 h-5" />
              </NavLink>
            </motion.button>
          </div>

          {/* Center - Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Air Quality
          </motion.h1>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Favorites */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <NavLink to="/favorites" className="flex items-center">
                <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {favoritesCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </NavLink>
            </motion.button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
