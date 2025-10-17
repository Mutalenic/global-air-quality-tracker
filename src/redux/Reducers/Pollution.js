import {
  ADD_POLLUTION,
  POLLUTION_ERROR,
  POLLUTION_LOADING,
  CLEAR_POLLUTION,
} from '../Actions/Pollution';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const pollutionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POLLUTION: {
      // Check if the pollution data already exists in the state
      const exists = state.data.some((pollution) => pollution.id === action.payload.id);
      if (exists) {
        return { ...state, loading: false }; // Set loading to false even if data exists
      }
      return {
        ...state,
        data: [...state.data, action.payload],
        error: null,
        loading: false,
      };
    }
    case POLLUTION_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case POLLUTION_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_POLLUTION:
      return {
        ...state,
        data: [],
        error: null,
      };
    default:
      return state;
  }
};

export default pollutionReducer;
