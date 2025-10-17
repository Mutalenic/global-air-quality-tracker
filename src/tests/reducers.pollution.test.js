import pollutionReducer from '../redux/Reducers/Pollution';
import * as actions from '../redux/Actions/Pollution';

describe('Pollution Reducer', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(pollutionReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle POLLUTION_LOADING', () => {
    const action = {
      type: actions.POLLUTION_LOADING,
      payload: true,
    };
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(pollutionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle ADD_POLLUTION', () => {
    const mockPollution = {
      id: '0-37',
      lat: 0,
      lng: 37,
      name: 'Kenya',
      aqi: 3,
      pm25: 10.5,
    };
    const action = {
      type: actions.ADD_POLLUTION,
      payload: mockPollution,
    };
    const expectedState = {
      data: [mockPollution],
      loading: false,
      error: null,
    };
    expect(pollutionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle POLLUTION_ERROR', () => {
    const errorMessage = 'Failed to load pollution data';
    const action = {
      type: actions.POLLUTION_ERROR,
      payload: errorMessage,
    };
    const expectedState = {
      ...initialState,
      error: errorMessage,
    };
    expect(pollutionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_POLLUTION', () => {
    const stateWithData = {
      data: [{ id: '0-37', aqi: 3 }],
      loading: false,
      error: null,
    };
    const action = {
      type: actions.CLEAR_POLLUTION,
    };
    expect(pollutionReducer(stateWithData, action)).toEqual(initialState);
  });

  it('should handle multiple actions in sequence', () => {
    let state = pollutionReducer(initialState, {
      type: actions.POLLUTION_LOADING,
      payload: true,
    });
    expect(state.loading).toBe(true);

    const mockPollution = { id: '0-37', aqi: 3 };
    state = pollutionReducer(state, {
      type: actions.ADD_POLLUTION,
      payload: mockPollution,
    });
    expect(state.data).toEqual([mockPollution]);
    expect(state.loading).toBe(false);

    state = pollutionReducer(state, {
      type: actions.CLEAR_POLLUTION,
    });
    expect(state.data).toEqual([]);
  });
});
