/**
 * Weather API Service
 * This service handles interactions with the Open-Meteo weather API
 * to fetch weather data and forecasts for correlation with air quality data.
 */

const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetches current weather data and forecast for a specific location
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Promise} - Promise containing weather data
 */
export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m,precipitation',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      current_weather: 'true'
    });

    const response = await fetch(`${WEATHER_API_BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetches air quality forecast data from Open-Meteo
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Promise} - Promise containing air quality forecast data
 */
export const fetchAirQualityForecast = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone',
      timezone: 'auto'
    });
    
    // Open-Meteo uses a different endpoint for air quality
    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Air Quality API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching air quality forecast:', error);
    throw error;
  }
};

/**
 * Helper function to combine weather and air quality data in a single request
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Promise} - Promise containing combined weather and air quality data
 */
export const fetchCombinedWeatherAndAirQuality = async (latitude, longitude) => {
  try {
    const [weatherData, airQualityData] = await Promise.all([
      fetchWeatherData(latitude, longitude),
      fetchAirQualityForecast(latitude, longitude)
    ]);
    
    return {
      weather: weatherData,
      airQuality: airQualityData
    };
  } catch (error) {
    console.error('Error fetching combined data:', error);
    throw error;
  }
};

/**
 * Converts weather codes to human-readable descriptions
 * Based on WMO weather interpretation codes
 * @param {number} code - The WMO weather code
 * @returns {string} - Human readable weather description
 */
export const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  
  return weatherCodes[code] || 'Unknown';
};

/**
 * Analyze how weather conditions affect air quality
 * @param {Object} weatherData - Weather data object
 * @param {Object} airQualityData - Air quality data object
 * @returns {Object} - Analysis results with messages
 */
export const analyzeWeatherAirQualityRelationship = (weatherData, airQualityData) => {
  const analysis = {
    effects: [],
    overallImpact: 'neutral',
    recommendations: []
  };
  
  // Extract relevant data
  const temperature = weatherData.current_weather?.temperature || 0;
  const windSpeed = weatherData.current_weather?.windspeed || 0;
  const weatherCode = weatherData.current_weather?.weathercode || 0;
  
  // Get the most recent hour's air quality data if available
  const latestHourIndex = airQualityData.hourly?.time?.length - 1 || 0;
  const pm25Level = airQualityData.hourly?.pm2_5?.[latestHourIndex] || 0;
  
  // Temperature effects
  if (temperature > 30) {
    analysis.effects.push({
      factor: 'temperature',
      description: 'High temperatures accelerate chemical reactions that form ozone and other pollutants.',
      impact: 'negative'
    });
    analysis.recommendations.push('Consider limiting outdoor activities during peak heat hours.');
  }
  
  // Wind effects
  if (windSpeed < 5) {
    analysis.effects.push({
      factor: 'wind',
      description: 'Low wind speed allows pollutants to accumulate near the ground.',
      impact: 'negative'
    });
  } else if (windSpeed > 20) {
    analysis.effects.push({
      factor: 'wind',
      description: 'Strong winds help disperse pollutants, improving air quality.',
      impact: 'positive'
    });
    analysis.overallImpact = 'positive';
  }
  
  // Precipitation effects
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    analysis.effects.push({
      factor: 'precipitation',
      description: 'Rain helps clear particulate matter from the air.',
      impact: 'positive'
    });
    analysis.overallImpact = 'positive';
  }
  
  // PM2.5 levels and weather combined analysis
  if (pm25Level > 35 && windSpeed < 5) {
    analysis.recommendations.push('Poor air quality and stagnant air conditions. Consider using air purifiers indoors.');
  }
  
  return analysis;
};

export default {
  fetchWeatherData,
  fetchAirQualityForecast,
  fetchCombinedWeatherAndAirQuality,
  getWeatherDescription,
  analyzeWeatherAirQualityRelationship
};