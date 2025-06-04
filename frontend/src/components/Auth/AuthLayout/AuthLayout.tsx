import { ReactNode } from 'react';
import styles from './AuthLayout.module.scss';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.content}>{children}</div>
      </div>
    </main>
  );
};
