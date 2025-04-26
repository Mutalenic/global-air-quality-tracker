import {
  FETCH_WEATHER_START,
  FETCH_WEATHER_SUCCESS,
  FETCH_WEATHER_FAILURE,
  FETCH_AIR_QUALITY_FORECAST_START,
  FETCH_AIR_QUALITY_FORECAST_SUCCESS,
  FETCH_AIR_QUALITY_FORECAST_FAILURE,
  FETCH_COMBINED_DATA_START,
  FETCH_COMBINED_DATA_SUCCESS,
  FETCH_COMBINED_DATA_FAILURE,
} from '../Actions/Weather';

const initialState = {
  weatherData: null,
  airQualityForecast: null,
  combinedData: null,
  analysis: null,
  loading: {
    weather: false,
    airQualityForecast: false,
    combinedData: false,
  },
  error: {
    weather: null,
    airQualityForecast: null,
    combinedData: null,
  },
};

const weatherReducer = (state = initialState, action) => {
  switch (action.type) {
    // Weather Data Actions
    case FETCH_WEATHER_START:
      return {
        ...state,
        loading: {
          ...state.loading,
          weather: true,
        },
        error: {
          ...state.error,
          weather: null,
        },
      };
    case FETCH_WEATHER_SUCCESS:
      return {
        ...state,
        weatherData: action.payload,
        loading: {
          ...state.loading,
          weather: false,
        },
      };
    case FETCH_WEATHER_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          weather: false,
        },
        error: {
          ...state.error,
          weather: action.payload,
        },
      };

    // Air Quality Forecast Actions
    case FETCH_AIR_QUALITY_FORECAST_START:
      return {
        ...state,
        loading: {
          ...state.loading,
          airQualityForecast: true,
        },
        error: {
          ...state.error,
          airQualityForecast: null,
        },
      };
    case FETCH_AIR_QUALITY_FORECAST_SUCCESS:
      return {
        ...state,
        airQualityForecast: action.payload,
        loading: {
          ...state.loading,
          airQualityForecast: false,
        },
      };
    case FETCH_AIR_QUALITY_FORECAST_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          airQualityForecast: false,
        },
        error: {
          ...state.error,
          airQualityForecast: action.payload,
        },
      };

    // Combined Data Actions
    case FETCH_COMBINED_DATA_START:
      return {
        ...state,
        loading: {
          ...state.loading,
          combinedData: true,
        },
        error: {
          ...state.error,
          combinedData: null,
        },
      };
    case FETCH_COMBINED_DATA_SUCCESS:
      return {
        ...state,
        combinedData: action.payload,
        weatherData: action.payload.weather,
        airQualityForecast: action.payload.airQuality,
        analysis: action.payload.analysis,
        loading: {
          ...state.loading,
          combinedData: false,
        },
      };
    case FETCH_COMBINED_DATA_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          combinedData: false,
        },
        error: {
          ...state.error,
          combinedData: action.payload,
        },
      };

    default:
      return state;
  }
};

export default weatherReducer;
