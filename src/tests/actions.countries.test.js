import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../redux/Actions/Countries';
import * as api from '../redux/apiFunctions';

// Mock the API functions
jest.mock('../redux/apiFunctions');

// Mock toast utilities
jest.mock('../utils/toastUtils', () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Countries Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Action Creators', () => {
    it('should create an action to add countries', () => {
      const payload = [{ name: 'Test Country' }];
      const expectedAction = {
        type: actions.ADD_COUNTRIES,
        payload,
      };
      expect(actions.addCountries(payload)).toEqual(expectedAction);
    });

    it('should create an action to set countries error', () => {
      const error = 'Test error';
      const expectedAction = {
        type: actions.COUNTRIES_ERROR,
        payload: error,
      };
      expect(actions.setCountriesError(error)).toEqual(expectedAction);
    });

    it('should create an action to set countries loading', () => {
      const loading = true;
      const expectedAction = {
        type: actions.COUNTRIES_LOADING,
        payload: loading,
      };
      expect(actions.setCountriesLoading(loading)).toEqual(expectedAction);
    });
  });

  describe('Async Actions', () => {
    it('should dispatch ADD_COUNTRIES when fetching countries succeeds', async () => {
      const mockCountries = [
        {
          name: { common: 'Kenya' },
          latlng: [0, 37],
          population: 47564296,
          cca2: 'KE',
          flags: { png: 'flag.png' },
        },
      ];

      api.fetchCountries.mockResolvedValue(mockCountries);

      const expectedActions = [
        { type: actions.COUNTRIES_LOADING, payload: true },
        {
          type: actions.ADD_COUNTRIES,
          payload: [
            {
              name: { common: 'Kenya' },
              region: 'Africa',
              latlng: [0, 37],
              population: 47564296,
              code: 'KE',
              flags: { png: 'flag.png' },
            },
          ],
        },
        { type: actions.COUNTRIES_ERROR, payload: null },
        { type: actions.COUNTRIES_LOADING, payload: false },
      ];

      const store = mockStore({});
      await store.dispatch(actions.getCountries('Africa'));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch COUNTRIES_ERROR when fetching countries fails', async () => {
      const errorMessage = 'Network error';
      api.fetchCountries.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({});
      await store.dispatch(actions.getCountries('Africa'));

      const actionsDispatched = store.getActions();
      expect(actionsDispatched[0].type).toBe(actions.COUNTRIES_LOADING);
      expect(actionsDispatched[1].type).toBe(actions.COUNTRIES_ERROR);
      expect(actionsDispatched[1].payload).toBe(errorMessage);
      expect(actionsDispatched[2].type).toBe(actions.COUNTRIES_LOADING);
    });

    it('should dispatch COUNTRIES_ERROR when no countries are found', async () => {
      api.fetchCountries.mockResolvedValue([]);

      const store = mockStore({});
      await store.dispatch(actions.getCountries('UnknownRegion'));

      const actionsDispatched = store.getActions();
      expect(actionsDispatched[1].type).toBe(actions.COUNTRIES_ERROR);
      expect(actionsDispatched[1].payload).toContain('No countries found');
    });
  });
});
