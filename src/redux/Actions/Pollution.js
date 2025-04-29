import { getPollutionInfor } from '../apiFunctions';

export const ADD_POLLUTION = 'air-quality-data/Pollution/ADD_POLLUTION';
export const POLLUTION_ERROR = 'air-quality-data/Pollution/POLLUTION_ERROR';

export const addPollution = (payload) => ({
  type: ADD_POLLUTION,
  payload,
});

export const pollutionError = (error) => ({
  type: POLLUTION_ERROR,
  payload: { error },
});

export const getPollutionData = (lat, lng, flag, name) => async (dispatch) => {
  try {
    const pollutions = await getPollutionInfor(lat, lng);

    // Check if the API returned a valid response with the list property
    if (!pollutions || !pollutions.list || !pollutions.list[0]) {
      throw new Error('Invalid response format from pollution API');
    }

    const pollutionData = {
      id: `${lat}-${lng}`,
      lat,
      lng,
      flag,
      name,
      city: name,
      aqi: pollutions.list[0].main.aqi,
      pm25: pollutions.list[0].components.pm2_5,
      pm10: pollutions.list[0].components.pm10,
      o3: pollutions.list[0].components.o3,
      no2: pollutions.list[0].components.no2,
      so2: pollutions.list[0].components.so2,
      co: pollutions.list[0].components.co,
    };

    dispatch({
      type: ADD_POLLUTION,
      payload: pollutionData,
    });
  } catch (error) {
    dispatch(pollutionError(error.message || 'Failed to load pollution data'));
  }
};
