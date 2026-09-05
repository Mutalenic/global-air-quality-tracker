import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getFromCache, saveToCache, getCountriesCacheKey, getPollutionCacheKey } from '../utils/cacheUtils';

// Types
export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  latlng: number[];
  cca2: string;
  cca3: string;
}

export interface PollutionData {
  id: string;
  city: string;
  flag: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  lat: number;
  lon: number;
}

export interface FavoriteLocation {
  id: string;
  name: string;
  flag: string;
  region: string;
  population?: number;
  lat: number;
  lng: number;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  clouds: number;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  timestamp: number;
}

export interface ForecastData {
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  clouds: number;
  description: string;
  icon: string;
}

// Store interfaces
interface CountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  selectedRegion: string | null;
  fetchCountries: (region: string) => Promise<void>;
  clearCountries: () => void;
  setSelectedRegion: (region: string) => void;
}

interface PollutionState {
  pollutionData: PollutionData[];
  loading: boolean;
  error: string | null;
  fetchPollution: (lat: number, lon: number, city: string, flag: string) => Promise<void>;
  clearPollution: () => void;
}

interface WeatherState {
  weatherData: WeatherData | null;
  forecast: ForecastData[];
  loading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  fetchForecast: (lat: number, lon: number, days?: number) => Promise<void>;
  clearWeather: () => void;
}

interface FavoritesState {
  favorites: FavoriteLocation[];
  addFavorite: (location: FavoriteLocation) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
  getFavoritesCount: () => number;
}

// Countries Store
export const useCountriesStore = create<CountriesState>()(
  devtools(
    (set) => ({
      countries: [],
      loading: false,
      error: null,
      selectedRegion: null,

      fetchCountries: async (region: string) => {
        set({ loading: true, error: null });

        try {
          const cacheKey = getCountriesCacheKey(region);
          const cachedData = getFromCache<Country[]>(cacheKey);

          if (cachedData) {
            set({ countries: cachedData, loading: false, selectedRegion: region });
            return;
          }

          const apiKey = import.meta.env.VITE_RESTCOUNTRIES_API_KEY;

          if (!apiKey) {
            throw new Error('REST Countries API key is not configured');
          }

          // In development, use the Vite proxy to avoid CORS issues.
          // In production, call the API directly (the key's CORS origins
          // must be configured in the REST Countries dashboard).
          const isDev = import.meta.env.DEV;
          const baseUrl = isDev
            ? '/api/restcountries'
            : 'https://api.restcountries.com/countries/v5';

          const response = await fetch(
            `${baseUrl}?region=${encodeURIComponent(region)}&limit=100&response_fields=names.common,names.official,codes.alpha_2,codes.alpha_3,coordinates,population,flag.url_png,flag.url_svg,region,subregion,capitals`,
            { headers: { Authorization: `Bearer ${apiKey}` } },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (!data.data || !Array.isArray(data.data.objects) || data.data.objects.length === 0) {
            throw new Error(`No countries returned for region: ${region}`);
          }

          // Map v5 response to the Country interface expected by the app
          const countries: Country[] = data.data.objects.map((obj: any) => ({
            name: {
              common: obj.names?.common ?? '',
              official: obj.names?.official ?? obj.names?.common ?? '',
            },
            flags: {
              png: obj.flag?.url_png ?? '',
              svg: obj.flag?.url_svg ?? '',
            },
            capital: (obj.capitals ?? []).map((c: any) => c.name).filter(Boolean),
            region: obj.region ?? '',
            subregion: obj.subregion ?? '',
            population: obj.population ?? 0,
            latlng: [obj.coordinates?.lat ?? 0, obj.coordinates?.lng ?? 0],
            cca2: obj.codes?.alpha_2 ?? '',
            cca3: obj.codes?.alpha_3 ?? '',
          }));

          // Cache the data
          saveToCache(cacheKey, countries);

          set({ countries, loading: false, selectedRegion: region });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      clearCountries: () => set({ countries: [], error: null, selectedRegion: null }),

      setSelectedRegion: (region: string) => set({ selectedRegion: region }),
    }),
    { name: 'countries-store' },
  ),
);

// Pollution Store
export const usePollutionStore = create<PollutionState>()(
  devtools(
    (set) => ({
      pollutionData: [],
      loading: false,
      error: null,

      fetchPollution: async (lat: number, lon: number, city: string, flag: string) => {
        set({ loading: true, error: null });

        try {
          const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

          if (!apiKey) {
            throw new Error('OpenWeather API key is not configured');
          }

          const cacheKey = getPollutionCacheKey(lat, lon);
          const cachedData = getFromCache<PollutionData[]>(cacheKey);

          if (cachedData) {
            set({ pollutionData: cachedData, loading: false });
            return;
          }

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
          );

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Invalid API key');
            }
            if (response.status === 404) {
              throw new Error('Location not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (!data.list || data.list.length === 0) {
            throw new Error('No pollution data available');
          }

          const pollutionData: PollutionData[] = data.list.map((item: any, index: number) => ({
            id: `${city}_${index}`,
            city,
            flag,
            aqi: item.main.aqi,
            pm25: item.components.pm2_5,
            pm10: item.components.pm10,
            o3: item.components.o3,
            no2: item.components.no2,
            so2: item.components.so2,
            co: item.components.co,
            lat,
            lon,
          }));

          // Cache the data
          saveToCache(cacheKey, pollutionData);

          set({ pollutionData, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      clearPollution: () => set({ pollutionData: [], error: null }),
    }),
    { name: 'pollution-store' },
  ),
);

// Weather Store
export const useWeatherStore = create<WeatherState>()(
  devtools(
    (set) => ({
      weatherData: null,
      forecast: [],
      loading: false,
      error: null,

      fetchWeather: async (lat: number, lon: number) => {
        set({ loading: true, error: null });

        try {
          const weatherService = (await import('../services/weatherService')).default;
          const data = await weatherService.getCurrentWeather(lat, lon);

          set({ weatherData: data, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      fetchForecast: async (lat: number, lon: number, days: number = 5) => {
        set({ loading: true, error: null });

        try {
          const weatherService = (await import('../services/weatherService')).default;
          const data = await weatherService.getWeatherForecast(lat, lon, days);

          set({ forecast: data, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      clearWeather: () => set({ weatherData: null, forecast: [], error: null }),
    }),
    { name: 'weather-store' },
  ),
);

// Favorites Store
export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    (set, get) => {
      // Load favorites from localStorage on initialization
      const storedFavorites = localStorage.getItem('favorites');
      const initialFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      return {
        favorites: initialFavorites,

        addFavorite: (location: FavoriteLocation) => {
          const { favorites } = get();
          const exists = favorites.some(fav => fav.id === location.id);

          if (!exists) {
            const newFavorites = [...favorites, location];
            set({ favorites: newFavorites });
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
          }
        },

        removeFavorite: (id: string) => {
          const { favorites } = get();
          const newFavorites = favorites.filter(fav => fav.id !== id);
          set({ favorites: newFavorites });
          localStorage.setItem('favorites', JSON.stringify(newFavorites));
        },

        clearFavorites: () => {
          set({ favorites: [] });
          localStorage.removeItem('favorites');
        },

        isFavorite: (id: string) => {
          const { favorites } = get();
          return favorites.some(fav => fav.id === id);
        },

        getFavoritesCount: () => {
          const { favorites } = get();
          return favorites?.length || 0;
        },
      };
    },
    { name: 'favorites-store' },
  ),
);
