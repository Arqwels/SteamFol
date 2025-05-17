import styles from './TableCell.module.scss';
import { formatNumber } from '../../../utils/formatNumber';
import { getChangeClass } from '../../../utils/getChangeClass';

type TableCell_Price24hProps = {
  price_item: number;
  change_price_percent_24h: number;
  currencyCode?: string;
};

export const TableCell_Price24h = ({
  price_item,
  change_price_percent_24h,
  currencyCode
}: TableCell_Price24hProps) => {
  const cls = getChangeClass(change_price_percent_24h);

  return (
    <td className={styles.price24h}>
      <span>{formatNumber(price_item, { currency: currencyCode })}</span>
      <span className={styles[cls]}>{change_price_percent_24h}%</span>
    </td>
  );
};
