import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import styles from './Table.module.scss';

export const Table = () => {
  return (
    <table className={styles.table}>
      <TableHeader />
      <TableBody />
    </table>
  )
};
