import { render, cleanup } from '@testing-library/react';
import Countries from '../components/Details/Countries';
import { TestWrapper } from '../utils/testUtils';

afterEach(cleanup);

describe('countries list ', () => {
  test('Countries renders correctly', () => {
    const countries = render(
      <TestWrapper>
        <Countries />
      </TestWrapper>,
    );
    expect(countries).toMatchSnapshot();
  });
});
