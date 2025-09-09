import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // Will be proxied in production
    prepareHeaders: (headers) => {
      // Add common headers here if needed
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Countries', 'Pollution', 'Weather', 'AirQuality'],
  endpoints: () => ({}),
});

// Export hooks will be available after endpoints are injected