import { ADD_POLLUTION, POLLUTION_ERROR } from '../Actions/Pollution';

// Initialize state with a null error property
const initialState = {
  pollutionData: [],
  error: null,
};

const pollutionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POLLUTION: {
      // Check if the pollution data already exists in the state
      const exists = state.pollutionData.some((pollution) => pollution.id === action.payload.id);
      if (exists) {
        return state; // Return the existing state if the data already exists
      }
      return {
        ...state,
        pollutionData: [...state.pollutionData, action.payload],
        error: null, // Clear any previous errors
      };
    }
    case POLLUTION_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default pollutionReducer;
