import { ADD_COUNTRIES, COUNTRIES_ERROR, COUNTRIES_LOADING } from '../Actions/Countries';

const initialState = {
  countries: [],
  loading: false,
  error: null,
};

const countriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COUNTRIES: {
      const newCountries = action.payload || [];
      return {
        ...state,
        countries: newCountries,
        error: null,
        loading: false,
      };
    }
    case COUNTRIES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case COUNTRIES_ERROR: {
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
