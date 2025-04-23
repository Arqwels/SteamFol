import React from 'react';
import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';
import { getChangeClass } from '../../../utils/getChangeClass';
import { COMMISSION_RATE } from '../../../utils/config';

type TableCell_CurrentProfitProps = {
  price_item: number;
  buy_price: number;
  count_items: number;
  commissionRate?: number; // Комиссия в виде дробного коэффициента (по умолчанию берётся из конфига, ~0.1304)
  currencyCode?: string;
};

const calculateProfit = (
  price_item: number,
  buy_price: number,
  count_items: number,
  commissionRate: number = COMMISSION_RATE
): { profitValue: number, profitPercent: number, netProfit: number } => {
  // Общая сумма инвестиций
  const investment = buy_price * count_items;
  // Текущая стоимость активов
  const currentProfit = price_item * count_items;
  // Разница между текущей стоимостью и инвестициями (прибыль/убыток)
  const profitValue = +(currentProfit - investment).toFixed(2);
  // Процент прибыли/убытка относительно инвестиций
  const profitPercent = +(((profitValue / investment) * 100) || 0).toFixed(2);
  // Чистая прибыль после вычета комиссии из конфига
  const netProfit = +((price_item * count_items * (1 - commissionRate)) - investment).toFixed(2);

  return { profitValue, profitPercent, netProfit };
};

export const TableCell_CurrentProfit: React.FC<TableCell_CurrentProfitProps> = ({
  price_item,
  buy_price,
  count_items,
  commissionRate = COMMISSION_RATE,
  currencyCode
}) => {
  const { profitValue, profitPercent, netProfit } = calculateProfit(
    price_item,
    buy_price,
    count_items,
    commissionRate
  );

  const cls = getChangeClass(profitValue);
  const netCls = getChangeClass(netProfit);

  return (
    <td className={`${styles.currentProfit} ${styles[cls]}`}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <span>{formatNumber(profitValue, { currency: currencyCode })}</span>
        <span className={styles[netCls]}>
          ({formatNumber(netProfit, { currency: currencyCode })})
        </span>
      </div>
      <span>{profitPercent}%</span>
    </td>
  )
};
