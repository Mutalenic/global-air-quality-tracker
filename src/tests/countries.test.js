import { render, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import pollutionReducer from '../redux/Reducers/Pollution';
import countriesReducer from '../redux/Reducers/Countries';
import Countries from '../components/Details/Countries';

const rootReducer = combineReducers({
  countriesReducer,
  pollutionReducer,
});

// Only use thunk in tests, no logger
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
