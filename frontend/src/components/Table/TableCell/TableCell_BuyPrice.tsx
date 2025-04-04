import React from 'react';
import { formatNumber } from '../../../utils/formatNumber';

type TableCell_BuyPriceProps = {
  buy_price: number;
  currencyCode?: string;
};

export const TableCell_BuyPrice: React.FC<TableCell_BuyPriceProps> = ({ buy_price, currencyCode }) => {
  return (
    <td>
      <span>{formatNumber(buy_price, { currency: currencyCode })}</span>
    </td>
  );
};
