import { TableHeader } from './TableHeader';
import styles from './Table.module.scss';
import { TableBody } from './TableBody';
import { TableData } from '../../types/TableData';

export const Table = () => {
  const data: TableData[] = [
    {
      id: 1,
      market_name: 'AK-47 | Буйство красок',
      market_hash_name: 'AK-47 | Буйство красок',
      price_item: 30,
      change_price_percent_24h: 3.99,
      change_price_profit_24h: -33.22,
      image_url: '/360fx360f2.png',
      count_items: 10,
      buy_price: 25,
      currencyCode: 'RUB'
    },
    {
      id: 2,
      market_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
      market_hash_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
      price_item: 31.21,
      change_price_percent_24h: -13.99,
      change_price_profit_24h: 333.22,
      image_url: '/360fx360f.png',
      count_items: 33,
      buy_price: 328.33,
      currencyCode: 'RUB'
    },
    {
      id: 3,
      market_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024 PGL Major Copenhagen 2024',
      market_hash_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
      price_item: 1100.21,
      change_price_percent_24h: -13.99,
      change_price_profit_24h: 333.22,
      image_url: '/360fx360f.png',
      count_items: 450,
      buy_price: 9328.33,
      currencyCode: 'RUB'
    }
  ]

  return (
    <table className={styles.table}>
      <TableHeader />
      <TableBody data={data} />
    </table>
  );
};
