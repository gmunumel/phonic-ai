import { configureStore } from "@reduxjs/toolkit";
import recorderReducer from "store/recorderSlice";

export const store = configureStore({
  reducer: {
    recorder: recorderReducer,
  },
});
