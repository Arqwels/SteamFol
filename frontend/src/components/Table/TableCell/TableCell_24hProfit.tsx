import React from 'react';
import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';

type TableCell_24hProfitProps = {
  change_price_profit_24h: number;
  currencyCode?: string;
};

export const TableCell_24hProfit: React.FC<TableCell_24hProfitProps> = ({ change_price_profit_24h, currencyCode }) => {
  // Условие для определения класса (если цена снизилась - применяем .loss, иначе .profit)
  const priceChangeClass = change_price_profit_24h < 0 ? styles.loss : styles.profit;

  return (
    <td>
      <span className={priceChangeClass}>{formatNumber(change_price_profit_24h, { currency: currencyCode })}</span>
    </td>
  );
};
