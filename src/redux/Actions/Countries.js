import { fetchCountries } from '../apiFunctions';

export const ADD_COUNTRIES = 'air-quality-data/Countries/ADD_COUNTRIES';
export const SET_PAGINATION = 'air-quality-data/Countries/SET_PAGINATION';
export const FETCH_COUNTRIES_REQUEST = 'air-quality-data/Countries/FETCH_COUNTRIES_REQUEST';
export const FETCH_COUNTRIES_SUCCESS = 'air-quality-data/Countries/FETCH_COUNTRIES_SUCCESS';
export const FETCH_COUNTRIES_FAILURE = 'air-quality-data/Countries/FETCH_COUNTRIES_FAILURE';

export const addCountries = (payload) => ({
  type: ADD_COUNTRIES,
  payload,
});

export const setPagination = (page, totalPages, totalItems) => ({
  type: SET_PAGINATION,
  payload: { page, totalPages, totalItems },
});

export const fetchCountriesRequest = () => ({
  type: FETCH_COUNTRIES_REQUEST,
});

export const fetchCountriesSuccess = (countries) => ({
  type: FETCH_COUNTRIES_SUCCESS,
  payload: countries,
});

export const fetchCountriesFailure = (error) => ({
  type: FETCH_COUNTRIES_FAILURE,
  payload: error,
});

export const getCountries = (reg) => async (dispatch) => {
  dispatch(fetchCountriesRequest());
  try {
    const countries = await fetchCountries(reg);
    const mappedCountries = countries.map((country) => ({
      name: country.name,
      region: reg,
      latlng: country.latlng,
      population: country.population,
      code: country.cca2,
      flag: country.flags.png,
    }));
    
    dispatch(fetchCountriesSuccess(mappedCountries));
    dispatch(setPagination(1, Math.ceil(mappedCountries.length / 10), mappedCountries.length));
  } catch (error) {
    dispatch(fetchCountriesFailure(error.message));
  }
};

// New function to get paginated countries
export const getPaginatedCountries = (reg, page, limit = 10) => async (dispatch) => {
  dispatch(fetchCountriesRequest());
  try {
    const countries = await fetchCountries(reg, page, limit);
    const mappedCountries = countries.map((country) => ({
      name: country.name,
      region: reg,
      latlng: country.latlng,
      population: country.population,
      code: country.cca2,
      flag: country.flags.png,
    }));
    
    dispatch(fetchCountriesSuccess(mappedCountries));
    dispatch(setPagination(page, Math.ceil(countries.length / limit), countries.length));
  } catch (error) {
    dispatch(fetchCountriesFailure(error.message));
  }
};
