import { getPollutionInfor } from '../apiFunctions';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';

export const ADD_POLLUTION = 'air-quality-data/Pollution/ADD_POLLUTION';
export const POLLUTION_ERROR = 'air-quality-data/Pollution/POLLUTION_ERROR';
export const POLLUTION_LOADING = 'air-quality-data/Pollution/POLLUTION_LOADING';
export const CLEAR_POLLUTION = 'air-quality-data/Pollution/CLEAR_POLLUTION';

export const addPollution = (payload) => ({
  type: ADD_POLLUTION,
  payload,
});

export const setPollutionError = (error) => ({
  type: POLLUTION_ERROR,
  payload: error,
});

export const setPollutionLoading = (loading) => ({
  type: POLLUTION_LOADING,
  payload: loading,
});

export const clearPollution = () => ({
  type: CLEAR_POLLUTION,
});

export const getPollutionData = (lat, lng, flag, name) => async (dispatch) => {
  dispatch(setPollutionLoading(true));
  try {
    const pollutions = await getPollutionInfor(lat, lng);

    if (!pollutions || !pollutions.list || pollutions.list.length === 0) {
      throw new Error('No pollution data available for this location');
    }

    dispatch({
      type: ADD_POLLUTION,
      payload: {
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
      },
    });
    dispatch(setPollutionError(null)); // Clear any previous errors
    showSuccessToast(`Pollution data loaded for ${name}`);
  } catch (error) {
    const errorMsg = error.message || 'Failed to load pollution data';
    dispatch(setPollutionError(errorMsg));
    showErrorToast(errorMsg);
  } finally {
    dispatch(setPollutionLoading(false));
  }
};
