import {
  fetchWeatherData,
  fetchAirQualityForecast as fetchAirQualityData,
  fetchCombinedWeatherAndAirQuality as fetchCombined,
  analyzeWeatherAirQualityRelationship,
} from '../../services/weatherApi';

// Action Types
export const FETCH_WEATHER_START = 'FETCH_WEATHER_START';
export const FETCH_WEATHER_SUCCESS = 'FETCH_WEATHER_SUCCESS';
export const FETCH_WEATHER_FAILURE = 'FETCH_WEATHER_FAILURE';
export const FETCH_AIR_QUALITY_FORECAST_START = 'FETCH_AIR_QUALITY_FORECAST_START';
export const FETCH_AIR_QUALITY_FORECAST_SUCCESS = 'FETCH_AIR_QUALITY_FORECAST_SUCCESS';
export const FETCH_AIR_QUALITY_FORECAST_FAILURE = 'FETCH_AIR_QUALITY_FORECAST_FAILURE';
export const FETCH_COMBINED_DATA_START = 'FETCH_COMBINED_DATA_START';
export const FETCH_COMBINED_DATA_SUCCESS = 'FETCH_COMBINED_DATA_SUCCESS';
export const FETCH_COMBINED_DATA_FAILURE = 'FETCH_COMBINED_DATA_FAILURE';

// Action Creators
export const fetchWeatherStart = () => ({
  type: FETCH_WEATHER_START,
});

export const fetchWeatherSuccess = (weatherData) => ({
  type: FETCH_WEATHER_SUCCESS,
  payload: weatherData,
});

export const fetchWeatherFailure = (error) => ({
  type: FETCH_WEATHER_FAILURE,
  payload: error,
});

export const fetchAirQualityForecastStart = () => ({
  type: FETCH_AIR_QUALITY_FORECAST_START,
});

export const fetchAirQualityForecastSuccess = (forecastData) => ({
  type: FETCH_AIR_QUALITY_FORECAST_SUCCESS,
  payload: forecastData,
});

export const fetchAirQualityForecastFailure = (error) => ({
  type: FETCH_AIR_QUALITY_FORECAST_FAILURE,
  payload: error,
});

export const fetchCombinedDataStart = () => ({
  type: FETCH_COMBINED_DATA_START,
});

export const fetchCombinedDataSuccess = (combinedData) => ({
  type: FETCH_COMBINED_DATA_SUCCESS,
  payload: combinedData,
});

export const fetchCombinedDataFailure = (error) => ({
  type: FETCH_COMBINED_DATA_FAILURE,
  payload: error,
});

// Thunk Action Creators
export const fetchWeather = (latitude, longitude) => async (dispatch) => {
  dispatch(fetchWeatherStart());
  try {
    const weatherData = await fetchWeatherData(latitude, longitude);
    dispatch(fetchWeatherSuccess(weatherData));
    return weatherData;
  } catch (error) {
    dispatch(fetchWeatherFailure(error.message));
    throw error;
  }
};

export const fetchAirQualityForecast = (latitude, longitude) => async (dispatch) => {
  dispatch(fetchAirQualityForecastStart());
  try {
    const forecastData = await fetchAirQualityData(latitude, longitude);
    dispatch(fetchAirQualityForecastSuccess(forecastData));
    return forecastData;
  } catch (error) {
    dispatch(fetchAirQualityForecastFailure(error.message));
    throw error;
  }
};

export const fetchCombinedWeatherAndAirQuality = (latitude, longitude) => async (dispatch) => {
  dispatch(fetchCombinedDataStart());
  try {
    const combinedData = await fetchCombined(latitude, longitude);

    // Analyze the relationship between weather and air quality
    const analysis = analyzeWeatherAirQualityRelationship(
      combinedData.weather,
      combinedData.airQuality,
    );

    // Add the analysis to the combined data
    const enrichedData = {
      ...combinedData,
      analysis,
    };

    dispatch(fetchCombinedDataSuccess(enrichedData));
    return enrichedData;
  } catch (error) {
    dispatch(fetchCombinedDataFailure(error.message));
    throw error;
  }
};
