import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ScoreResult } from "../types/score";

interface ScoreState {
  data: ScoreResult | null;
  draftMode: "file" | "text";
  draftText: string;
}

const scoreSlice = createSlice({
  name: "score",
  initialState: { data: null, draftMode: "file", draftText: "" } as ScoreState,
  reducers: {
    setScoreData: (state, action: PayloadAction<ScoreResult>) => {
      state.data = action.payload;
    },
    clearScoreData: (state) => {
      state.data = null;
    },
    setDraftMode: (state, action: PayloadAction<"file" | "text">) => {
      state.draftMode = action.payload;
    },
    setDraftText: (state, action: PayloadAction<string>) => {
      state.draftText = action.payload;
    },
    clearDraftState: (state) => {
      state.draftMode = "file";
      state.draftText = "";
    },
  },
});

export const {
  setScoreData,
  clearScoreData,
  setDraftMode,
  setDraftText,
  clearDraftState,
} = scoreSlice.actions;
export default scoreSlice.reducer;
