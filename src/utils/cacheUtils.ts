// Local storage cache utilities

export const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Cache key prefixes that clearOldCache/clearAllCache will clean up
const CACHE_PREFIXES = [
  'cache_',
  'countries_',
  'pollution_',
  'weather_',
  'forecast_',
  'airvisual_',
];

const isCacheKey = (key: string): boolean => CACHE_PREFIXES.some((p) => key.startsWith(p));

/**
 * Get data from localStorage cache
 */
export const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached) as { data: T; timestamp: number };
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

/**
 * Clear all expired cache entries
 */
export const clearOldCache = (): void => {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (isCacheKey(key)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached) as { timestamp: number };
            if (now - timestamp >= CACHE_DURATION) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch {
    // Silent fail
  }
};

/**
 * Save data to localStorage cache
 */
export const saveToCache = <T>(key: string, data: T): void => {
  try {
    const cacheObject = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    // If localStorage is full, clear old cache
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      clearOldCache();
      // Try again
      try {
        const cacheObject = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheObject));
      } catch {
        // Silent fail
      }
    }
  }
};

/**
 * Clear specific cache entry
 */
export const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silent fail
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (isCacheKey(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Silent fail
  }
};

/**
 * Get cache key for countries by region
 */
export const getCountriesCacheKey = (region: string): string => `cache_countries_${region}`;

/**
 * Get cache key for pollution data
 */
export const getPollutionCacheKey = (lat: number, lon: number): string =>
  `cache_pollution_${lat}_${lon}`;
