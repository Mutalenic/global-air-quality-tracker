import { render, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import Countries from '../components/Details/Countries';

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
