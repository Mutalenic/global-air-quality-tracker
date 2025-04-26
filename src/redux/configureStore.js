import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import countriesReducer from './Reducers/Countries';
import pollutionReducer from './Reducers/Pollution';
import weatherReducer from './Reducers/Weather';

// Remove logger in production to improve performance
const middleware = [thunk];

// Only include redux-logger in development
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const { logger } = require('redux-logger');
  middleware.push(logger);
}

const rootReducer = combineReducers({
  countriesReducer,
  pollutionReducer,
  weatherReducer,
});

// Configure store with state persistence
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('airQualityState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('airQualityState', serializedState);
  } catch {
    // Ignore write errors
  }
};

const persistedState = loadState();
const store = createStore(
  rootReducer,
  persistedState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

// Save the state whenever it changes
store.subscribe(() => {
  saveState({
    countriesReducer: store.getState().countriesReducer,
    // Don't persist pollution data - it's fetched on demand
    // Don't persist weather data - it's also fetched on demand and frequently changes
  });
});

export default store;
