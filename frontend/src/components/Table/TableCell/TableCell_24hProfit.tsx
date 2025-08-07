import { formatNumber } from '../../../utils/formatNumber';
import { getChangeClass } from '../../../utils/getChangeClass';

type TableCell_24hProfitProps = {
  count_items: number;
  change_price_profit_24h: number;
  currencyCode?: string;
};

export const TableCell_24hProfit = ({ count_items, change_price_profit_24h, currencyCode }: TableCell_24hProfitProps) => {
  const totalProfit = (count_items * change_price_profit_24h)

  const cls = getChangeClass(totalProfit);
  return (
    <td>
      <span className={cls}>{formatNumber(totalProfit, { currency: currencyCode })}</span>
    </td>
  );
};
