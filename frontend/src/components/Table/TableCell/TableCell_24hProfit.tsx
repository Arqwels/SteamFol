import React from 'react';
import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';
import { getChangeClass } from '../../../utils/getChangeClass';

type TableCell_24hProfitProps = {
  change_price_profit_24h: number;
  currencyCode?: string;
};

export const TableCell_24hProfit: React.FC<TableCell_24hProfitProps> = ({ change_price_profit_24h, currencyCode }) => {
  const cls = getChangeClass(change_price_profit_24h);

  return (
    <td>
      <span className={styles[cls]}>{formatNumber(change_price_profit_24h, { currency: currencyCode })}</span>
    </td>
  );
};
