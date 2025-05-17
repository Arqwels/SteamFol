// Текущая прибыль, без учёта комиссии
export const calcCurrentProfit = (assets: number, invest: number): number =>
  +((assets - invest).toFixed(2));
