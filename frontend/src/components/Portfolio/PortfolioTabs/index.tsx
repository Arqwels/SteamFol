import { Tab } from './Tab';
import styles from './PortfolioTabs.module.scss';

interface PortfolioTabsProps {
  items: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export const PortfolioTabs = ({ items, activeIndex, onChange }: PortfolioTabsProps) => {
  return (
    <div className={styles.tabs}>
      {items.map((tab, index) => (
        <Tab
          key={index}
          label={tab}
          isActive={index === activeIndex}
          onClick={() => onChange(index)}
        />
      ))}
    </div>
  )
};
