import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PollutionItem {
  id: string;
  lat: number;
  lng: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
  aqi: number;
}

// This maintains compatibility with the existing component structure
type PollutionState = PollutionItem[];

const initialState: PollutionState = [];

const pollutionSlice = createSlice({
  name: 'pollutionReducer',
  initialState,
  reducers: {
    setPollutionData: (state, action: PayloadAction<PollutionItem[]>) => {
      return action.payload;
    },
    addPollutionItem: (state, action: PayloadAction<PollutionItem>) => {
      state.push(action.payload);
    },
  },
});

export const { setPollutionData, addPollutionItem } = pollutionSlice.actions;
export default pollutionSlice.reducer;