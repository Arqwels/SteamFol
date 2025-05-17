import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';
import activePortfolioReducer from './reducers/activePortfolioSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    activePortfolio: activePortfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
