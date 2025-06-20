import { TableData } from '../../types';
import { TableRow } from './TableRow';

export const TableBody = ({ data }: { data: TableData[] }) => {
  return (
    <tbody>
      {data.map((row) => (
        <TableRow key={row.id} row={row} />
      ))}
    </tbody>
  );
};
