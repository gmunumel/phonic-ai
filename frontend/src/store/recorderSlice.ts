import { createSlice } from "@reduxjs/toolkit";

const recorderSlice = createSlice({
  name: "recorder",
  initialState: { isRecording: false },
  reducers: {
    startRecord: (state) => {
      state.isRecording = true;
    },
    stopRecord: (state) => {
      state.isRecording = false;
    },
  },
});

export const { startRecord, stopRecord } = recorderSlice.actions;
export default recorderSlice.reducer;
