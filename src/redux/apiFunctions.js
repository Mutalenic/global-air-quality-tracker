import {
  getFromCache,
  saveToCache,
  getCountriesCacheKey,
  getPollutionCacheKey,
} from '../utils/cacheUtils';

export const fetchCountries = async (reg) => {
  // Check cache first
  const cacheKey = getCountriesCacheKey(reg);
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    const isArray = Array.isArray(cachedData);
    if (!isArray || (isArray && cachedData.length > 0)) {
      return cachedData;
    }
  }

  // Use region-specific endpoint to avoid 400 error from /all endpoint
  const response = await fetch(`https://restcountries.com/v3.1/region/${reg.toLowerCase()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No countries returned for region: ${reg}`);
  }

  // Save to cache
  saveToCache(cacheKey, data);

  return data;
};

const url = 'https://api.openweathermap.org/data/2.5/air_pollution?';
const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

// Validate API key on module load
if (!apiKey && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.warn('REACT_APP_OPENWEATHER_API_KEY is not defined in environment variables');
}

export const getPollutionInfor = async (lat, lon) => {
  if (!apiKey) {
    throw new Error(
      'OpenWeather API key is not configured. Please add REACT_APP_OPENWEATHER_API_KEY to your .env file'
    );
  }

  if (!lat || !lon) {
    throw new Error('Latitude and longitude are required');
  }

  // Check cache first
  const cacheKey = getPollutionCacheKey(lat, lon);
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(`${url}lat=${lat}&lon=${lon}&appid=${apiKey}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeather API key');
    }
    if (response.status === 404) {
      throw new Error('Location not found');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.list || data.list.length === 0) {
    throw new Error('No pollution data available for this location');
  }

  // Save to cache
  saveToCache(cacheKey, data);

  return data;
};

// Export alias for backward compatibility
export const fetchPollution = getPollutionInfor;
