import { configureStore } from "@reduxjs/toolkit";
import { searchApi } from "../api/searchApi";

export const store = configureStore({
  reducer: {
    [searchApi.reducerPath]: searchApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(searchApi.middleware),
})