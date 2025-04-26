import {
  ADD_COUNTRIES,
  SET_PAGINATION,
  FETCH_COUNTRIES_REQUEST,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAILURE,
} from '../Actions/Countries';

const initialState = {
  countries: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 0,
    totalItems: 0,
  },
};

const countriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COUNTRIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.payload,
        loading: false,
      };
    case FETCH_COUNTRIES_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    case ADD_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
      };
    default:
      return state;
  }
};

export default countriesReducer;
