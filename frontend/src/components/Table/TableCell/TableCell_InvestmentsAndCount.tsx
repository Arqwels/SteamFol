import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';
import { calcInvest } from '../../../utils/calculations';

type TableCell_InvestmentsAndCountProps = {
  count_items: number;
  buy_price: number;
  currencyCode?: string;
};

export const TableCell_InvestmentsAndCount = ({
  count_items,
  buy_price,
  currencyCode
}: TableCell_InvestmentsAndCountProps) => {
  const investment = calcInvest(count_items, buy_price);

  return (
    <td className={styles.investmentsAndCount}>
      <span>{formatNumber(investment, { currency: currencyCode })}</span>
      <span className={styles.investmentCount}>{count_items} шт.</span>
    </td>
  );
};
