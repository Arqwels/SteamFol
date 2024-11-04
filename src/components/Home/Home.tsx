import { InvestmentTable } from './InvestmentTable/InvestmentTable';
import { Navigation } from './Navigation/Navigation';

const data = [
  {
    id: 1,
    market_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024 Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
    market_hash_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
    price_item: 30,
    image_url: '/360fx360f2.png',
    countItems: 10,
    buyPrice: 25
  },
  {
    id: 2,
    market_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024 Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
    market_hash_name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
    price_item: 31.21,
    image_url: '/360fx360f.png',
    countItems: 33,
    buyPrice: 328.33
  },
  {
    id: 3,
    market_name: 'AK-47 | Буйство красок',
    market_hash_name: 'AK-47 | Буйство красок',
    price_item: 1004.12,
    image_url: '/360fx360f3.png',
    countItems: 4,
    buyPrice: 743.99
  },
];

export const Home = () => {
  return (
    <>
      <Navigation />
      <InvestmentTable data={data} />
    </>
  );
};