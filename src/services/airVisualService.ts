import { PollutionData } from '../store/useAppStore';

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
    this.apiKey = process.env.REACT_APP_AIRVISUAL_API_KEY || '';
  }

  async getNearestCityData(lat: number, lon: number): Promise<PollutionData> {
    if (!this.apiKey) {
      throw new Error('AirVisual API key is not configured');
    }

    const cacheKey = `airvisual_${lat}_${lon}`;
    const cachedData = this.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${this.baseUrl}/nearest_city?lat=${lat}&lon=${lon}&key=${this.apiKey}`
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

    this.saveToCache(cacheKey, pollutionData);
    return pollutionData;
  }

  async getCityData(city: string, state?: string, country?: string): Promise<PollutionData> {
    if (!this.apiKey) {
      throw new Error('AirVisual API key is not configured');
    }

    const cacheKey = `airvisual_city_${city}_${state}_${country}`;
    const cachedData = this.getFromCache(cacheKey);
    
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

    this.saveToCache(cacheKey, pollutionData);
    return pollutionData;
  }

  async getCountries(): Promise<Array<{ name: string; code: string; aqi: number }>> {
    if (!this.apiKey) {
      throw new Error('AirVisual API key is not configured');
    }

    const cacheKey = 'airvisual_countries';
    const cachedData = this.getFromCache(cacheKey);
    
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

    const countries = data.data.countries.map((country: any) => ({
      name: country.name,
      code: country.code,
      aqi: country.current?.pollution?.aqius || 0,
    }));

    this.saveToCache(cacheKey, countries);
    return countries;
  }

  private getFromCache(key: string): any | null {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 30 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  private saveToCache(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }
}

export default new AirVisualService();
