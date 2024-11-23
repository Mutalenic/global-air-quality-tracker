import { ADD_POLLUTION } from '../Actions/Pollution';

const pollutionReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_POLLUTION:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default pollutionReducer;
