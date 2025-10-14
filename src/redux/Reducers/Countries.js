import { ADD_COUNTRIES, COUNTRIES_ERROR, COUNTRIES_LOADING } from '../Actions/Countries';

const initialState = {
  countries: [],
  loading: false,
  error: null,
};

const countriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
        error: null,
        loading: false,
      };
    case COUNTRIES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case COUNTRIES_ERROR:
      return {
        ...state,
        error: action.payload,
        countries: [],
      };
    default:
      return state;
  }
};

export default countriesReducer;
