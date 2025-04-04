import React from 'react';
import { formatNumber } from '../../../utils/formatNumber';

type TableCell_HoldingsProps = {
  price_item: number;
  count_items: number;
  commissionPercent?: number; // Комиссия в процентах (по умолчанию 13%)
  currencyCode?: string;
};

export const TableCell_Holdings: React.FC<TableCell_HoldingsProps> = ({ 
  price_item,
  count_items,
  commissionPercent = 13,
  currencyCode,
}) => {
  // Общая стоимость активов
  const holdings: number = +(price_item * count_items).toFixed(2);
  // Стоимость активов с учетом вычета комиссии
  const holdingsWithCimmissions: number = +(holdings * (1 - commissionPercent / 100)).toFixed(2);

  return (
    <td style={{ gap: '8px' }}>
      <span>{formatNumber(holdings, { currency: currencyCode })}</span>
      <span>({formatNumber(holdingsWithCimmissions, { currency: currencyCode })})</span>
    </td>
  );
};
