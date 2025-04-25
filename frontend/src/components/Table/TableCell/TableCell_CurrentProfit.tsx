import React from 'react';
import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';
import { getChangeClass } from '../../../utils/getChangeClass';
import { COMMISSION_RATE } from '../../../utils/config';
import { calculateInvestmentProfit } from '../../../utils/investmentCalculations';

type TableCell_CurrentProfitProps = {
  price_item: number;
  buy_price: number;
  count_items: number;
  commissionRate?: number;
  currencyCode?: string;
};

export const TableCell_CurrentProfit: React.FC<TableCell_CurrentProfitProps> = ({
  price_item,
  buy_price,
  count_items,
  commissionRate = COMMISSION_RATE,
  currencyCode
}) => {
  const { profitValue, profitPercent, netProfit } = calculateInvestmentProfit(
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
