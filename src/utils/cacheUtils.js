// Local storage cache utilities

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Get data from localStorage cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem(key);
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Clear all expired cache entries
 */
export const clearOldCache = () => {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith('cache_')) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached);
            if (now - timestamp >= CACHE_DURATION) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    // Silent fail
  }
};

/**
 * Save data to localStorage cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const saveToCache = (key, data) => {
  try {
    const cacheObject = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    // If localStorage is full, clear old cache
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      // Try again
      try {
        const cacheObject = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheObject));
      } catch (retryError) {
        // Silent fail
      }
    }
  }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key to clear
 */
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Silent fail
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    // Silent fail
  }
};

/**
 * Get cache key for countries by region
 * @param {string} region - Region name
 * @returns {string} - Cache key
 */
export const getCountriesCacheKey = (region) => `cache_countries_${region}`;

/**
 * Get cache key for pollution data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} - Cache key
 */
export const getPollutionCacheKey = (lat, lon) => `cache_pollution_${lat}_${lon}`;
