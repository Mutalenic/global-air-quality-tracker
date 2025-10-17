import { fetchCountries } from '../apiFunctions';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';

export const ADD_COUNTRIES = 'air-quality-data/Countries/ADD_COUNTRIES';
export const COUNTRIES_ERROR = 'air-quality-data/Countries/COUNTRIES_ERROR';
export const COUNTRIES_LOADING = 'air-quality-data/Countries/COUNTRIES_LOADING';

export const addCountries = (payload) => ({
  type: ADD_COUNTRIES,
  payload,
});

export const setCountriesError = (error) => ({
  type: COUNTRIES_ERROR,
  payload: error,
});

export const setCountriesLoading = (loading) => ({
  type: COUNTRIES_LOADING,
  payload: loading,
});

export const getCountries = (reg) => async (dispatch) => {
  dispatch(setCountriesLoading(true));
  try {
    const countries = await fetchCountries(reg);

    if (!countries || countries.length === 0) {
      const errorMsg = `No countries found in ${reg} region`;
      dispatch(setCountriesError(errorMsg));
      showErrorToast(errorMsg);
      return;
    }

    const processedCountries = countries.map((country) => ({
      name: country.name,
      region: reg,
      latlng: country.latlng,
      population: country.population,
      code: country.cca2,
      flags: country.flags,
    }));

    dispatch({
      type: ADD_COUNTRIES,
      payload: processedCountries,
    });
    dispatch(setCountriesError(null)); // Clear any previous errors

    try {
      showSuccessToast(`Loaded ${countries.length} countries from ${reg}`);
    } catch (toastError) {
      // Silent catch to avoid interrupting flow if toast fails
    }
  } catch (error) {
    const errorMsg = error.message || 'Failed to load countries';
    dispatch(setCountriesError(errorMsg));
    showErrorToast(errorMsg);
  } finally {
    dispatch(setCountriesLoading(false));
  }
};
