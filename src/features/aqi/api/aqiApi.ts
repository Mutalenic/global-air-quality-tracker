import { baseApi } from '../../shared/api/baseApi';
import { config } from '../../shared/config';

export interface Country {
  name: string;
  region: string;
  latlng: [number, number];
  population: number;
  code: string;
  flag: string;
}

export interface PollutionData {
  coord: {
    lon: number;
    lat: number;
  };
  list: Array<{
    dt: number;
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

// Extend the base API with AQI-specific endpoints
export const aqiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], string>({
      query: (region) => `/countries?region=${region}`,
      transformResponse: (response: any[], meta, arg) => {
        const region = arg; // Get region from the argument
        return response
          .filter((country) => country.region === region)
          .map((country) => ({
            name: country.name,
            region,
            latlng: country.latlng,
            population: country.population,
            code: country.cca2,
            flag: country.flags.png,
          }));
      },
      providesTags: ['Countries'],
    }),
    getPollution: builder.query<PollutionData, { lat: number; lon: number }>({
      query: ({ lat, lon }) => 
        `/pollution?lat=${lat}&lon=${lon}&appid=${config.api.openWeatherApiKey}`,
      providesTags: ['Pollution'],
    }),
  }),
});

export const { useGetCountriesQuery, useGetPollutionQuery } = aqiApi;