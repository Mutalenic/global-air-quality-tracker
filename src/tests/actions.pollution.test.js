import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../redux/Actions/Pollution';
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

describe('Pollution Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Action Creators', () => {
    it('should create an action to add pollution', () => {
      const payload = { aqi: 3, pm25: 10.5 };
      const expectedAction = {
        type: actions.ADD_POLLUTION,
        payload,
      };
      expect(actions.addPollution(payload)).toEqual(expectedAction);
    });

    it('should create an action to set pollution error', () => {
      const error = 'Test error';
      const expectedAction = {
        type: actions.POLLUTION_ERROR,
        payload: error,
      };
      expect(actions.setPollutionError(error)).toEqual(expectedAction);
    });

    it('should create an action to set pollution loading', () => {
      const loading = true;
      const expectedAction = {
        type: actions.POLLUTION_LOADING,
        payload: loading,
      };
      expect(actions.setPollutionLoading(loading)).toEqual(expectedAction);
    });

    it('should create an action to clear pollution', () => {
      const expectedAction = {
        type: actions.CLEAR_POLLUTION,
      };
      expect(actions.clearPollution()).toEqual(expectedAction);
    });
  });

  describe('Async Actions', () => {
    it('should dispatch ADD_POLLUTION when fetching pollution succeeds', async () => {
      const mockPollution = {
        list: [
          {
            main: { aqi: 3 },
            components: {
              pm2_5: 10.5,
              pm10: 20.3,
              o3: 50.2,
              no2: 15.4,
              so2: 5.1,
              co: 300.2,
            },
          },
        ],
      };

      api.getPollutionInfor.mockResolvedValue(mockPollution);

      const store = mockStore({});
      await store.dispatch(actions.getPollutionData(0, 37, 'flag.png', 'Kenya'));

      const actionsDispatched = store.getActions();
      expect(actionsDispatched[0].type).toBe(actions.POLLUTION_LOADING);
      expect(actionsDispatched[1].type).toBe(actions.ADD_POLLUTION);
      expect(actionsDispatched[1].payload).toMatchObject({
        lat: 0,
        lng: 37,
        name: 'Kenya',
        aqi: 3,
        pm25: 10.5,
      });
      expect(actionsDispatched[2].type).toBe(actions.POLLUTION_ERROR);
      expect(actionsDispatched[3].type).toBe(actions.POLLUTION_LOADING);
    });

    it('should dispatch POLLUTION_ERROR when fetching pollution fails', async () => {
      const errorMessage = 'API error';
      api.getPollutionInfor.mockRejectedValue(new Error(errorMessage));

      const store = mockStore({});
      await store.dispatch(actions.getPollutionData(0, 37, 'flag.png', 'Kenya'));

      const actionsDispatched = store.getActions();
      expect(actionsDispatched[1].type).toBe(actions.POLLUTION_ERROR);
      expect(actionsDispatched[1].payload).toBe(errorMessage);
    });

    it('should dispatch POLLUTION_ERROR when no pollution data available', async () => {
      api.getPollutionInfor.mockResolvedValue({ list: [] });

      const store = mockStore({});
      await store.dispatch(actions.getPollutionData(0, 37, 'flag.png', 'Kenya'));

      const actionsDispatched = store.getActions();
      expect(actionsDispatched[1].type).toBe(actions.POLLUTION_ERROR);
      expect(actionsDispatched[1].payload).toContain('No pollution data available');
    });
  });
});
