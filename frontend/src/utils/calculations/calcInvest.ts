// Сколько всего инвестиций(столбик "Вложений")
export const calcInvest = (count_items: number, buy_price: number): number =>
  +((count_items * buy_price).toFixed(2));
