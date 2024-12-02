import { getPollutionInfor } from '../apiFunctions';

export const ADD_POLLUTION = 'air-quality-data/Pollution/ADD_POLLUTION';

export const addPollution = (payload) => ({
  type: ADD_POLLUTION,
  payload,
});

export const getPollutionData = (lat, lng, flag, name) => async (dispatch) => {
  try {
    const pollutions = await getPollutionInfor(lat, lng);
    dispatch({
      type: ADD_POLLUTION,
      payload: {
        id: `${lat}-${lng}`,
        lat,
        lng,
        flag, // Include the flag URL in the payload
        name,
        city: name,
        aqi: pollutions.list[0].main.aqi,
        pm25: pollutions.list[0].components.pm2_5,
        pm10: pollutions.list[0].components.pm10,
        o3: pollutions.list[0].components.o3,
        no2: pollutions.list[0].components.no2,
        so2: pollutions.list[0].components.so2,
        co: pollutions.list[0].components.co,
      },
    });
  } catch (error) {
    console.error('Failed to fetch pollution data:', error);
  }
};
