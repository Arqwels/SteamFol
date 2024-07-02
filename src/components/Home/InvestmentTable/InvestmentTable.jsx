
import { InvestmentTableRow } from './InvestmentTableRow';
import styles from './InvestmentTable.module.scss';

export const InvestmentTable = ({ data }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Фото</th>
          <th>Название</th>
          <th>Цена</th>
          <th>Вложения</th>
          <th>Текущая цена</th>
          <th>Текущая прибыль</th>
          <th>Активы</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <InvestmentTableRow key={index} {...item} />
        ))}
      </tbody>
    </table>
  );
};