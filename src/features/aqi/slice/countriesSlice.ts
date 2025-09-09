import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Country {
  name: {
    common: string;
  };
  region: string;
  latlng: [number, number];
  population: number;
  cca2: string;
  flags: {
    png: string;
  };
}

// This maintains compatibility with the existing component structure
type CountriesState = Country[];

const initialState: CountriesState = [];

const countriesSlice = createSlice({
  name: 'countriesReducer',
  initialState,
  reducers: {
    addCountries: (state, action: PayloadAction<Country[]>) => {
      return action.payload;
    },
  },
});

export const { addCountries } = countriesSlice.actions;
export default countriesSlice.reducer;