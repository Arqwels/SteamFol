import React from 'react';
import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';

type TableCell_InvestmentsAndCountProps = {
  count_items: number;
  buy_price: number;
  currencyCode?: string;
};

export const TableCell_InvestmentsAndCount: React.FC<TableCell_InvestmentsAndCountProps> = ({ count_items, buy_price, currencyCode }) => {
  const investment: number = +(count_items * buy_price).toFixed(2);

  return (
    <td className={styles.investmentsAndCount}>
      <span>{formatNumber(investment, { currency: currencyCode })}</span>
      <span className={styles.investmentCount}>{count_items} шт.</span>
    </td>
  );
};
