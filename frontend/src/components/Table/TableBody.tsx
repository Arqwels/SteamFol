import { TableData } from '../../types/tableData';
import { TableRow } from './TableRow';
import { useGetInvestmentsQuery } from '../../api/investmentApi';
import { mapInvestmentToTableData } from '../../utils/mappers';
import { mockInvestments } from '../../mocks/mockInvestments';
import styles from './Table.module.scss';

export const TableBody = () => {
  const { data, isLoading, error } = useGetInvestmentsQuery();

  const usingMock = !data || !!error;

  // выбираем источник
  const investments = usingMock ? mockInvestments : data!;

  // преобразуем и добавляем флаг
  const tableData: (TableData & { isMock: boolean })[] = investments
    .map(mapInvestmentToTableData)
    .map(row => ({ ...row, isMock: usingMock }));

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
