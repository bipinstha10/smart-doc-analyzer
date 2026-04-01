import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ScoreResult } from "../types/score";

interface ScoreState {
  data: ScoreResult | null;
}

const scoreSlice = createSlice({
  name: "score",
  initialState: { data: null } as ScoreState,
  reducers: {
    setScoreData: (state, action: PayloadAction<ScoreResult>) => {
      state.data = action.payload;
    },
    clearScoreData: (state) => {
      state.data = null;
    },
  },
});

export const { setScoreData, clearScoreData } = scoreSlice.actions;
export default scoreSlice.reducer;
