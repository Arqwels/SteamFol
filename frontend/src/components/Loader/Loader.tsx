import styles from './Loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  )
};
