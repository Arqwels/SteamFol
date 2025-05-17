import { TableData } from '../../types';
import { TableRow } from './TableRow';
import { useGetInvestmentsQuery } from '../../api/investmentApi';
import { mapInvestmentToTableData } from '../../utils/mappers';
import { mockInvestments } from '../../mocks/mockApiInvestments';
import styles from './Table.module.scss';
import { useAppSelector } from '../../stores/hooks';
import { skipToken } from '@reduxjs/toolkit/query';

export const TableBody = () => {
  const portfolioId = useAppSelector(state => state.activePortfolio.portfolioId);
  const { data, isLoading, error } = useGetInvestmentsQuery(portfolioId ?? skipToken);

  const usingMock = !data || !!error;

  // выбираем источник
  const investments = usingMock ? mockInvestments : data!;

  // преобразуем и добавляем флаг
  const tableData: (TableData & { isMock: boolean })[] = investments
    .map(mapInvestmentToTableData)
    .map(row => ({ ...row, isMock: usingMock }));

  // Если массив пустой и нет ошибки, выводим сообщение об отсутствии инвестиций
  if (!usingMock && investments.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className={styles.emptyMessage}>
            У вас нет инвестиций
          </td>
        </tr>
      </tbody>
    );
  }

  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className={styles.skeletonShimmer}>&nbsp;</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {tableData.map((row) => (
        <TableRow
          key={row.id}
          row={row}
          isMock={row.isMock}
        />
      ))}
    </tbody>
  )
};
