import { PollutionData } from '../store/useAppStore';
import { getFromCache, saveToCache } from '../utils/cacheUtils';

interface AirVisualResponse {
  status: string;
  data: {
    city: string;
    state?: string;
    country: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    current: {
      pollution: {
        ts: string;
        aqius: number;
        aqicn: number;
        mainus: string;
        maincn: string;
        p1: {
          v: number;
        };
        p2: {
          v: number;
        };
      };
      weather: {
        ts: string;
        tp: number;
        pr: number;
        hu: number;
        ws: number;
        wd: number;
        ic: string;
      };
    };
  };
}

class AirVisualService {
  private apiKey: string;
  private baseUrl = 'https://api.airvisual.com/v2';

  constructor() {
    this.apiKey = import.meta.env.VITE_AIRVISUAL_API_KEY || '';
  }

  async getNearestCityData(lat: number, lon: number): Promise<PollutionData> {
    if (!this.apiKey) {
      throw new Error('AirVisual API key is not configured');
    }

    const cacheKey = `airvisual_${lat}_${lon}`;
    const cachedData = this.getFromCacheLocal(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${this.baseUrl}/nearest_city?lat=${lat}&lon=${lon}&key=${this.apiKey}`,
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key');
      }
      if (response.status === 429) {
        throw new Error('API rate limit exceeded');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AirVisualResponse = await response.json();

    if (data.status !== 'success') {
      throw new Error('API request failed');
    }

    const pollutionData: PollutionData = {
      id: `airvisual_${data.data.city}_${Date.now()}`,
      city: data.data.city,
      flag: `https://flagcdn.com/96x72/${data.data.country.toLowerCase()}.png`,
      aqi: data.data.current.pollution.aqius,
      pm25: data.data.current.pollution.p2.v,
      pm10: data.data.current.pollution.p1.v,
      o3: 0, // AirVisual doesn't provide O3 in this endpoint
      no2: 0, // AirVisual doesn't provide NO2 in this endpoint
      so2: 0, // AirVisual doesn't provide SO2 in this endpoint
      co: 0, // AirVisual doesn't provide CO in this endpoint
      lat,
      lon,
    };

    this.saveToCacheLocal(cacheKey, pollutionData);
    return pollutionData;
  }

  async getCityData(city: string, state?: string, country?: string): Promise<PollutionData> {
    if (!this.apiKey) {
      throw new Error('AirVisual API key is not configured');
    }

    const cacheKey = `airvisual_city_${city}_${state}_${country}`;
    const cachedData = this.getFromCacheLocal(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    let url = `${this.baseUrl}/city?city=${encodeURIComponent(city)}`;
    if (state) url += `&state=${encodeURIComponent(state)}`;
    if (country) url += `&country=${encodeURIComponent(country)}`;
    url += `&key=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AirVisualResponse = await response.json();

    if (data.status !== 'success') {
      throw new Error('API request failed');
    }

    const pollutionData: PollutionData = {
      id: `airvisual_${data.data.city}_${Date.now()}`,
      city: data.data.city,
      flag: `https://flagcdn.com/96x72/${data.data.country.toLowerCase()}.png`,
      aqi: data.data.current.pollution.aqius,
      pm25: data.data.current.pollution.p2.v,
      pm10: data.data.current.pollution.p1.v,
      o3: 0,
      no2: 0,
      so2: 0,
      co: 0,
      lat: data.data.location.coordinates[1],
      lon: data.data.location.coordinates[0],
    };

    this.saveToCacheLocal(cacheKey, pollutionData);
    return pollutionData;
  }

  async getCountries(): Promise<Array<{ name: string; code: string }>> {
    if (!this.apiKey) {
      throw new Error('AirVisual API key is not configured');
    }

    const cacheKey = 'airvisual_countries';
    const cachedData = this.getFromCacheLocal(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${this.baseUrl}/countries?key=${this.apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error('API request failed');
    }

    // The AirVisual /countries endpoint returns only { name, code } per country;
    // it does not include pollution data. AQI must be fetched per-city separately.
    const countries = data.data.countries.map((country: any) => ({
      name: country.name,
      code: country.code,
    }));

    this.saveToCacheLocal(cacheKey, countries);
    return countries;
  }

  private getFromCacheLocal(key: string): any | null {
    return getFromCache(key);
  }

  private saveToCacheLocal(key: string, data: any): void {
    saveToCache(key, data);
  }
}

export default new AirVisualService();
