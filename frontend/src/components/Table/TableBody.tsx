import React from 'react';
import { TableData } from '../../types/TableData';
import { TableRow } from './TableRow';

interface TableBodyProps {
  data: TableData[];
};

export const TableBody: React.FC<TableBodyProps> = ({ data }) => {
  return (
    <tbody>
      {data.map((row) => (
        <TableRow key={row.id} row={row} />
      ))}
    </tbody>
  );
};
