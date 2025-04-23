import React from 'react';
import { formatNumber } from '../../../utils/formatNumber';
import { COMMISSION_RATE } from '../../../utils/config';

type TableCell_HoldingsProps = {
  price_item: number;
  count_items: number;
  commissionRate?: number; // Коэффициент комиссии (по умолчанию берётся из конфига, ≈0.1304)
  currencyCode?: string;
};

export const TableCell_Holdings: React.FC<TableCell_HoldingsProps> = ({ 
  price_item,
  count_items,
  commissionRate = COMMISSION_RATE,
  currencyCode,
}) => {
  // Общая стоимость активов
  const holdings: number = +(price_item * count_items).toFixed(2);
  // Стоимость активов с учетом вычета комиссии
  const holdingsNet: number = +(holdings * (1 - commissionRate)).toFixed(2);

  return (
    <td style={{ gap: '8px' }}>
      <span>{formatNumber(holdings, { currency: currencyCode })}</span>
      <span>({formatNumber(holdingsNet, { currency: currencyCode })})</span>
    </td>
  )
};
