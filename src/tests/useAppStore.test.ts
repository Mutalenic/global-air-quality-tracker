import { act } from '@testing-library/react';

// Mock fetch globally
global.fetch = jest.fn() as jest.Mock;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useFavoritesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    // Reset module registry to get fresh store state
    jest.resetModules();
  });

  test('starts with empty favorites', async () => {
    const { useFavoritesStore } = await import('../store/useAppStore');
    expect(useFavoritesStore.getState().favorites).toEqual([]);
    expect(useFavoritesStore.getState().getFavoritesCount()).toBe(0);
  });

  test('addFavorite adds a location and persists to localStorage', async () => {
    const { useFavoritesStore } = await import('../store/useAppStore');
    const location = {
      id: 'KE',
      name: 'Kenya',
      flag: 'flag.png',
      region: 'Africa',
      lat: 0,
      lng: 37,
    };
    act(() => {
      useFavoritesStore.getState().addFavorite(location);
    });
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    expect(useFavoritesStore.getState().isFavorite('KE')).toBe(true);
    expect(useFavoritesStore.getState().getFavoritesCount()).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'favorites',
      JSON.stringify([location]),
    );
  });

  test('addFavorite does not add duplicates', async () => {
    const { useFavoritesStore } = await import('../store/useAppStore');
    const location = {
      id: 'KE',
      name: 'Kenya',
      flag: 'flag.png',
      region: 'Africa',
      lat: 0,
      lng: 37,
    };
    act(() => {
      useFavoritesStore.getState().addFavorite(location);
      useFavoritesStore.getState().addFavorite(location);
    });
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
  });

  test('removeFavorite removes a location', async () => {
    const { useFavoritesStore } = await import('../store/useAppStore');
    const location = {
      id: 'KE',
      name: 'Kenya',
      flag: 'flag.png',
      region: 'Africa',
      lat: 0,
      lng: 37,
    };
    act(() => {
      useFavoritesStore.getState().addFavorite(location);
      useFavoritesStore.getState().removeFavorite('KE');
    });
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    expect(useFavoritesStore.getState().isFavorite('KE')).toBe(false);
  });

  test('clearFavorites empties the list and localStorage', async () => {
    const { useFavoritesStore } = await import('../store/useAppStore');
    const location = {
      id: 'KE',
      name: 'Kenya',
      flag: 'flag.png',
      region: 'Africa',
      lat: 0,
      lng: 37,
    };
    act(() => {
      useFavoritesStore.getState().addFavorite(location);
      useFavoritesStore.getState().clearFavorites();
    });
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('favorites');
  });
});

describe('useCountriesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    jest.resetModules();
    (global.fetch as jest.Mock).mockReset();
  });

  test('starts with empty countries and no selected region', async () => {
    const { useCountriesStore } = await import('../store/useAppStore');
    expect(useCountriesStore.getState().countries).toEqual([]);
    expect(useCountriesStore.getState().selectedRegion).toBeNull();
    expect(useCountriesStore.getState().loading).toBe(false);
  });

  test('fetchCountries sets error on failed fetch', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const { useCountriesStore } = await import('../store/useAppStore');
    await act(async () => {
      await useCountriesStore.getState().fetchCountries('Africa');
    });
    expect(useCountriesStore.getState().error).toBe('Network error');
    expect(useCountriesStore.getState().loading).toBe(false);
  });

  test('clearCountries resets state', async () => {
    const { useCountriesStore } = await import('../store/useAppStore');
    act(() => {
      useCountriesStore.getState().setSelectedRegion('Africa');
      useCountriesStore.getState().clearCountries();
    });
    expect(useCountriesStore.getState().countries).toEqual([]);
    expect(useCountriesStore.getState().selectedRegion).toBeNull();
  });
});

describe('usePollutionStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    jest.resetModules();
    (global.fetch as jest.Mock).mockReset();
  });

  test('starts with empty pollution data', async () => {
    const { usePollutionStore } = await import('../store/useAppStore');
    expect(usePollutionStore.getState().pollutionData).toEqual([]);
    expect(usePollutionStore.getState().loading).toBe(false);
  });

  test('fetchPollution throws if API key is missing', async () => {
    const originalKey = process.env.VITE_OPENWEATHER_API_KEY;
    delete process.env.VITE_OPENWEATHER_API_KEY;
    jest.resetModules();
    const { usePollutionStore } = await import('../store/useAppStore');
    await act(async () => {
      await usePollutionStore.getState().fetchPollution(0, 37, 'Kenya', 'flag.png');
    });
    expect(usePollutionStore.getState().error).toBe('OpenWeather API key is not configured');
    expect(usePollutionStore.getState().loading).toBe(false);
    // Restore key for subsequent tests
    process.env.VITE_OPENWEATHER_API_KEY = originalKey;
  });

  test('clearPollution resets state', async () => {
    const { usePollutionStore } = await import('../store/useAppStore');
    act(() => {
      usePollutionStore.getState().clearPollution();
    });
    expect(usePollutionStore.getState().pollutionData).toEqual([]);
    expect(usePollutionStore.getState().error).toBeNull();
  });
});
