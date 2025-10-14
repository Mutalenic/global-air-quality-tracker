import countriesReducer from '../redux/Reducers/Countries';
import * as actions from '../redux/Actions/Countries';

describe('Countries Reducer', () => {
  const initialState = {
    countries: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(countriesReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle COUNTRIES_LOADING', () => {
    const action = {
      type: actions.COUNTRIES_LOADING,
      payload: true,
    };
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(countriesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle ADD_COUNTRIES', () => {
    const mockCountries = [
      { name: { common: 'Kenya' }, code: 'KE' },
      { name: { common: 'Uganda' }, code: 'UG' },
    ];
    const action = {
      type: actions.ADD_COUNTRIES,
      payload: mockCountries,
    };
    const expectedState = {
      countries: mockCountries,
      loading: false,
      error: null,
    };
    expect(countriesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle COUNTRIES_ERROR', () => {
    const errorMessage = 'Failed to load countries';
    const action = {
      type: actions.COUNTRIES_ERROR,
      payload: errorMessage,
    };
    const expectedState = {
      ...initialState,
      error: errorMessage,
    };
    expect(countriesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle multiple actions in sequence', () => {
    let state = countriesReducer(initialState, {
      type: actions.COUNTRIES_LOADING,
      payload: true,
    });
    expect(state.loading).toBe(true);

    const mockCountries = [{ name: { common: 'Kenya' }, code: 'KE' }];
    state = countriesReducer(state, {
      type: actions.ADD_COUNTRIES,
      payload: mockCountries,
    });
    expect(state.countries).toEqual(mockCountries);
    expect(state.loading).toBe(false);

    state = countriesReducer(state, {
      type: actions.COUNTRIES_ERROR,
      payload: null,
    });
    expect(state.error).toBe(null);
  });
});
