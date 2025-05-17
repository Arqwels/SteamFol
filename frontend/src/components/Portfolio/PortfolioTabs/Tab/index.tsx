import styles from './Tab.module.scss';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Tab = ({ label, isActive, onClick }: TabProps) => {
  return (
    <button
      className={`${styles.tab} ${isActive ? styles.active : ''}`}
      onClick={isActive ? undefined : onClick}
      disabled={isActive}
      type='button'
    >
      {label}
    </button>
  )
};
