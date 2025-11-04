import { render, cleanup } from '@testing-library/react';
import Pollutions from '../components/Home/Pollution';
import { TestWrapper } from '../utils/testUtils';

afterEach(cleanup);

describe('Pollution list ', () => {
  test('Pollution list renders correctly', () => {
    const pollution = render(
      <TestWrapper>
        <Pollutions />
      </TestWrapper>,
    );
    expect(pollution).toMatchSnapshot();
  });
});
