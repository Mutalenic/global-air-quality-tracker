import { render, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import Pollutions from '../components/Home/Pollution';

afterEach(cleanup);

describe('Pollution list ', () => {
  test('Pollution list renders correctly', () => {
    const pollution = render(
      <Provider store={store}>
        <Router>
          <Pollutions />
        </Router>
      </Provider>,
    );
    expect(pollution).toMatchSnapshot();
  });
});
