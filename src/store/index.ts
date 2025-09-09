import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../features/shared/api/baseApi';
import countriesReducer from '../features/aqi/slice/countriesSlice';
import pollutionReducer from '../features/aqi/slice/pollutionSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    // Legacy reducers for backward compatibility with existing components
    countriesReducer,
    pollutionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;