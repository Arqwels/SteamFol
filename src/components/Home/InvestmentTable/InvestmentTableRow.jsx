
import styles from './InvestmentTableRow.module.scss';

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

export const InvestmentTableRow = ({ photo, name, price, attachments, currentPrice, currentProfit, assets }) => {
  // Определяем максимальную длину текста для двух строк
  const maxLength = 65; // Вы можете настроить это значение в зависимости от ваших требований

  return (
    <tr className={styles.row}>
      <td><img src={photo} alt={name} className={styles.photo} /></td>
      <td className={styles.cell}>{truncateText(name, maxLength)}</td>
      <td className={styles.cell}>{price}</td>
      <td className={styles.cell}>{attachments}</td>
      <td className={styles.cell}>{currentPrice}</td>
      <td className={styles.cell}>{currentProfit}</td>
      <td className={styles.cell}>{assets}</td>
    </tr>
  );
};