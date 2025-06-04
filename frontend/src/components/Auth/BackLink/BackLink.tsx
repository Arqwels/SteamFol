import { Link } from 'react-router-dom';
import styles from './BackLink.module.scss';

export const BackLink = ({ to }: { to: string }) => (
  <Link to={to} className={styles.back}>
    ← Главная
  </Link>
);
