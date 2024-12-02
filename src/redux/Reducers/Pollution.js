import { ADD_POLLUTION } from '../Actions/Pollution';

const pollutionReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_POLLUTION: {
      // Check if the pollution data already exists in the state
      const exists = state.some((pollution) => pollution.id === action.payload.id);
      if (exists) {
        return state; // Return the existing state if the data already exists
      }
      return [...state, action.payload];
    }
    default:
      return state;
  }
};

export default pollutionReducer;
