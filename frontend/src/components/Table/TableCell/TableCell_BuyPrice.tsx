import { formatNumber } from '../../../utils/formatNumber';

type TableCell_BuyPriceProps = {
  buy_price: number;
  currencyCode?: string;
};

export const TableCell_BuyPrice = ({ buy_price, currencyCode }: TableCell_BuyPriceProps) => {
  return (
    <td>
      <span>{formatNumber(buy_price, { currency: currencyCode })}</span>
    </td>
  );
};
