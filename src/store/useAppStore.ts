import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
  forecast: any[];
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
  favoritesCount: number;
}

// Countries Store
export const useCountriesStore = create<CountriesState>()(
  devtools(
    (set, get) => ({
      countries: [],
      loading: false,
      error: null,
      selectedRegion: null,

      fetchCountries: async (region: string) => {
        set({ loading: true, error: null });
        
        try {
          const cacheKey = `countries_${region}`;
          const cachedData = localStorage.getItem(cacheKey);
          
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed.timestamp && Date.now() - parsed.timestamp < 30 * 60 * 1000) {
              set({ countries: parsed.data, loading: false, selectedRegion: region });
              return;
            }
          }

          const response = await fetch(`https://restcountries.com/v3.1/region/${region.toLowerCase()}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error(`No countries returned for region: ${region}`);
          }

          // Cache the data
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }));

          set({ countries: data, loading: false, selectedRegion: region });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      clearCountries: () => set({ countries: [], error: null, selectedRegion: null }),
      
      setSelectedRegion: (region: string) => set({ selectedRegion: region }),
    }),
    { name: 'countries-store' }
  )
);

// Pollution Store
export const usePollutionStore = create<PollutionState>()(
  devtools(
    (set, get) => ({
      pollutionData: [],
      loading: false,
      error: null,

      fetchPollution: async (lat: number, lon: number, city: string, flag: string) => {
        set({ loading: true, error: null });
        
        try {
          const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
          
          if (!apiKey) {
            throw new Error('OpenWeather API key is not configured');
          }

          const cacheKey = `pollution_${lat}_${lon}`;
          const cachedData = localStorage.getItem(cacheKey);
          
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed.timestamp && Date.now() - parsed.timestamp < 30 * 60 * 1000) {
              set({ pollutionData: parsed.data, loading: false });
              return;
            }
          }

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
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
          localStorage.setItem(cacheKey, JSON.stringify({
            data: pollutionData,
            timestamp: Date.now()
          }));

          set({ pollutionData, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      clearPollution: () => set({ pollutionData: [], error: null }),
    }),
    { name: 'pollution-store' }
  )
);

// Weather Store
export const useWeatherStore = create<WeatherState>()(
  devtools(
    (set, get) => ({
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
    { name: 'weather-store' }
  )
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

        get favoritesCount() {
          return get().favorites.length;
        },
      };
    },
    { name: 'favorites-store' }
  )
);
