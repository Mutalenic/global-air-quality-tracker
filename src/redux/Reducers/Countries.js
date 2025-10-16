import { ADD_COUNTRIES, COUNTRIES_ERROR, COUNTRIES_LOADING } from '../Actions/Countries';

const initialState = {
  countries: [],
  loading: false,
  error: null,
};

const countriesReducer = (state = initialState, action) => {
  console.log('Countries reducer called with action:', action.type, action.payload);

  switch (action.type) {
    case ADD_COUNTRIES:
      console.log('ADD_COUNTRIES - payload length:', action.payload?.length);
      console.log('ADD_COUNTRIES - first country:', action.payload?.[0]);
      const newCountries = action.payload || [];
      console.log('Setting countries to array of length:', newCountries.length);
      return {
        ...state,
        countries: newCountries,
        error: null,
        loading: false,
      };
    case COUNTRIES_LOADING:
      console.log('COUNTRIES_LOADING - loading:', action.payload);
      return {
        ...state,
        loading: action.payload,
      };
    case COUNTRIES_ERROR: {
      console.log('COUNTRIES_ERROR - error:', action.payload);
      const nextCountries = action.payload ? [] : state.countries;
      return {
        ...state,
        error: action.payload,
        countries: nextCountries,
      };
    }
    default:
      return state;
  }
};

export default countriesReducer;
