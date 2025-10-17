import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import countriesReducer from './Reducers/Countries';
import pollutionReducer from './Reducers/Pollution';

const rootReducer = combineReducers({
  countriesReducer,
  pollutionReducer,
});

// Add debugging to track state changes
const debugReducer = (state, action) => rootReducer(state, action);

// Only enable redux-logger in development mode
const middleware = [thunk];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = createStore(debugReducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
