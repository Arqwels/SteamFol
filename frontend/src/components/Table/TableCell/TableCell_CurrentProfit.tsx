import React from 'react';
import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';
import { getChangeClass } from '../../../utils/getChangeClass';

type TableCell_CurrentProfitProps = {
  price_item: number;
  buy_price: number;
  count_items: number;
  commissionPercent?: number; // Комиссия в процентах (по умолчанию 13%)
  currencyCode?: string;
};

const calculateProfit = (
  price_item: number,
  buy_price: number,
  count_items: number,
  commissionPercent: number = 13
): { profitValue: number, profitPercent: number, netProfit: number } => {
  // Общая сумма инвестиций
  const investment = buy_price * count_items;
  // Текущая стоимость активов
  const currentProfit = price_item * count_items;
  // Разница между текущей стоимостью и инвестициями (прибыль/убыток)
  const profitValue = +(currentProfit - investment).toFixed(2);
  // Процент прибыли/убытка относительно инвестиций
  const profitPercent = +(((profitValue / investment) * 100) || 0).toFixed(2);
  // Чистая прибыль после вычета комиссии
  const netProfit = +(profitValue * (1 - commissionPercent / 100)).toFixed(2);

  return { profitValue, profitPercent, netProfit };
};

export const TableCell_CurrentProfit: React.FC<TableCell_CurrentProfitProps> = ({
  price_item,
  buy_price,
  count_items,
  commissionPercent = 13,
  currencyCode
}) => {
  const { profitValue, profitPercent, netProfit } = calculateProfit(
    price_item,
    buy_price,
    count_items,
    commissionPercent
  );

  const cls = getChangeClass(profitValue);

  return (
    <td className={`${styles.currentProfit} ${styles[cls]}`}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <span>{formatNumber(profitValue, { currency: currencyCode })}</span>
        <span>({formatNumber(netProfit, { currency: currencyCode })})</span>
      </div>
      <span>{profitPercent}%</span>
    </td>
  );
};
