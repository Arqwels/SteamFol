// Процент текущей прибыли (рассчитывается только с учётом "текущей прибыли" без учёта комиссии)
export const calcCurrentProfitPercent = (
  currentProfit: number,
  invest: number,
): number =>
  +((((currentProfit / invest) * 100) || 0).toFixed(2));
