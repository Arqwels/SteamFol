import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import styles from './Table.module.scss';
import { useAppSelector } from '../../stores/hooks';
import { useGetInvestmentsQuery } from '../../api/investmentApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { TableData } from '../../types';
import { mapInvestmentToTableData } from '../../utils/mappers';

export const Table = () => {
  const portfolioId = useAppSelector(state => state.activePortfolio.portfolioId);
  const { data, isLoading, error } = useGetInvestmentsQuery(portfolioId ?? skipToken);
  const investments = data ?? [];

  if (isLoading) {
    return <div className={styles.loadingMessage}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>Ошибка загрузки данных</div>;
  }

  // Если массив пустой и нет ошибки, выводим сообщение об отсутствии инвестиций
  if (investments.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <div className={styles.emptyScreen}>
          <p>У вас отсутствуют инвестиции.</p>
          <p>Чтобы добавить скины в коллекцию, нажмите на кнопку плюсик внизу экрана.</p>
        </div>
        <div className={styles.downArrow} />
      </div>
    );
  }

  const tableData: TableData[] = investments.map(mapInvestmentToTableData);
  return (
    <table className={styles.table}>
      <TableHeader />
      <TableBody data={tableData} />
    </table>
  )
};
