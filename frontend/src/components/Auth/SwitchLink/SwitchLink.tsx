import { Link } from 'react-router-dom';
import styles from './SwitchLink.module.scss';

interface SwitchLinkProps {
  text: string;
  to: string;
  linkText: string;
}

export const SwitchLink = ({ text, to, linkText }: SwitchLinkProps) => {
  return (
    <p className={styles.switch}>
      {text}{' '}
      <Link to={to} className={styles.link}>
        {linkText}
      </Link>
    </p>
  );
};
