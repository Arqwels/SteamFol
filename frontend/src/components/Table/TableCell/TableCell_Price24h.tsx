import React from 'react';
import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';

type TableCell_Price24hProps = {
  price_item: number;
  change_price_percent_24h: number;
  currencyCode?: string;
};

export const TableCell_Price24h: React.FC<TableCell_Price24hProps> = ({ price_item, change_price_percent_24h, currencyCode }) => {
  // Условие для определения класса (если цена снизилась - применяем .loss, иначе .profit)
  const percentChangeClass = change_price_percent_24h < 0 ? styles.loss : styles.profit;

  return (
    <td className={styles.price24h}>
      <span>{formatNumber(price_item, { currency: currencyCode })}</span>
      <span className={percentChangeClass}>{change_price_percent_24h}%</span>
    </td>
  );
};
