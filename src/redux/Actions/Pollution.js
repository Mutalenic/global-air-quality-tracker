import { getPollutionInfor } from '../apiFunctions';

export const ADD_POLLUTION = 'air-quality-data/Pollution/ADD_POLLUTION';

export const addPollution = (payload) => ({
  type: ADD_POLLUTION,
  payload,
});

export const getPollutionData = (lat1, lng1, flag, name) => async (dispatch) => {
  try {
    const pollutions = await getPollutionInfor(lat1, lng1);
    dispatch({
      type: ADD_POLLUTION,
      payload: {
        id: `${lat1}-${lng1}`,
        city: name,
        aqi: pollutions.list[0].main.aqi,
        pm25: pollutions.list[0].components.pm2_5,
        pm10: pollutions.list[0].components.pm10,
        o3: pollutions.list[0].components.o3,
        no2: pollutions.list[0].components.no2,
        so2: pollutions.list[0].components.so2,
        co: pollutions.list[0].components.co,
        data: pollutions.list.map((item) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString(),
          pm25: item.components.pm2_5,
          pm10: item.components.pm10,
          o3: item.components.o3,
        })),
      },
    });
  } catch (error) {
    console.error('Failed to fetch pollution data:', error);
  }
};
