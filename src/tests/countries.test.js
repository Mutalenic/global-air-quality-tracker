import { render, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Countries from '../components/Details/Countries';

// Mock the Zustand stores with all stores used by rendered components
jest.mock('../store/useAppStore', () => ({
  useCountriesStore: () => ({
    countries: [],
    loading: false,
    error: null,
    selectedRegion: null,
    fetchCountries: jest.fn(),
    clearCountries: jest.fn(),
    setSelectedRegion: jest.fn(),
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

describe('Countries list ', () => {
  test('Countries renders empty state correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Router>
          <Countries />
        </Router>
      </ThemeProvider>,
    );
    expect(getByText(/No countries available/i)).toBeInTheDocument();
  });
});
