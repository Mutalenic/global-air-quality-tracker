import { WeatherData } from '../store/useAppStore';

interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY || '';
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key is not configured');
    }

    const cacheKey = `weather_${lat}_${lon}`;
    const cachedData = this.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
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

    const data: WeatherResponse = await response.json();

    const weatherData: WeatherData = {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      visibility: data.visibility,
      clouds: data.clouds.all,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timestamp: data.dt,
    };

    this.saveToCache(cacheKey, weatherData);
    return weatherData;
  }

  async getWeatherForecast(lat: number, lon: number, days: number = 5): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key is not configured');
    }

    const cacheKey = `forecast_${lat}_${lon}_${days}`;
    const cachedData = this.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const forecast = data.list.map((item: any) => ({
      timestamp: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: item.wind.speed,
      windDirection: item.wind.deg,
      clouds: item.clouds.all,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    this.saveToCache(cacheKey, forecast);
    return forecast;
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

export default new WeatherService();
