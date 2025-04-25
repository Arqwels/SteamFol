import { COMMISSION_RATE } from "./config";

/**
 * Функция для расчета прибыли/убытка и чистой прибыли от инвестиций.
 * @param price_item - текущая цена предмета
 * @param buy_price - цена покупки предмета
 * @param count_items - количество предметов
 * @param commissionRate - комиссия в виде дробного коэффициента (по умолчанию берется из конфигурации)
 * @returns объект с вычисленной прибылью, процентом прибыли и чистой прибылью
 */

export const calculateInvestmentProfit = (
  price_item: number,
  buy_price: number,
  count_items: number,
  commissionRate: number = COMMISSION_RATE
): { profitValue: number, profitPercent: number, netProfit: number } => {
  // Общая сумма инвестиций (Вложения)
  const investment = buy_price * count_items;
  // Текущая стоимость активов (Активы)
  const currentProfit = price_item * count_items;
  // Разница между текущей стоимостью и инвестициями (прибыль/убыток)
  const profitValue = +(currentProfit - investment).toFixed(2);
  // Процент прибыли/убытка относительно инвестиций
  const profitPercent = +(((profitValue / investment) * 100) || 0).toFixed(2);
  // Чистая прибыль после вычета комиссии из конфига
  const netProfit = +(profitValue - (profitValue * commissionRate)).toFixed(2);

  // Для Navigation
  

  return { profitValue, profitPercent, netProfit };
}
