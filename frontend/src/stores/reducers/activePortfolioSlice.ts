import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActivePortfolioState {
  portfolioId: number | null;
}

const initialState: ActivePortfolioState = {
  portfolioId: null
};

const activePortfolioSlice = createSlice({
  name: 'activePortfolio',
  initialState,
  reducers: {
    setActivePortfolio(state, action: PayloadAction<number>) {
      state.portfolioId = action.payload;
    },
  },
});

export const { setActivePortfolio } = activePortfolioSlice.actions;
export default activePortfolioSlice.reducer;
