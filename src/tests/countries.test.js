import { render, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import pollutionReducer from '../redux/Reducers/Pollution';
import countriesReducer from '../redux/Reducers/Countries';
import Countries from '../components/Details/Countries';

// Mock the web worker
jest.mock('../../workers/countriesWorker.js', () => {
  class MockWorker {
    constructor() {
      this.onmessage = jest.fn();
    }

    postMessage = jest.fn();

    terminate = jest.fn();
  }
  return MockWorker;
});

const rootReducer = combineReducers({
  countriesReducer,
  pollutionReducer,
});

// Don't include logger in tests to avoid console noise
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

afterEach(cleanup);

describe('countries list ', () => {
  test('Countries renders correctly', () => {
    const countries = render(
      <Provider store={store}>
        <Router>
          <Countries />
        </Router>
      </Provider>,
    );
    expect(countries).toMatchSnapshot();
  });
});
