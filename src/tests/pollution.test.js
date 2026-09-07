import { render, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Pollutions from '../components/Home/Pollution';

// Mock the Zustand stores with all stores used by rendered components
jest.mock('../store/useAppStore', () => ({
  usePollutionStore: () => ({
    pollutionData: [],
    loading: false,
    error: null,
    fetchPollution: jest.fn(),
    clearPollution: jest.fn(),
  }),
  useFavoritesStore: () => ({
    favorites: [],
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    clearFavorites: jest.fn(),
    isFavorite: jest.fn(() => false),
    getFavoritesCount: jest.fn(() => 0),
  }),
}));

afterEach(cleanup);

describe('Pollution list ', () => {
  test('Pollution list renders empty state correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Router>
          <Pollutions />
        </Router>
      </ThemeProvider>,
    );
    expect(getByText(/No pollution data available/i)).toBeInTheDocument();
  });
});
