import { Header } from './Header/Header';
import { InvestmentTable } from './InvestmentTable/InvestmentTable';

const data = [
  {
    photo: '/360fx360f.png',
    name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
    price: '1000 ₽',
    attachments: '500 ₽',
    currentPrice: '1200 ₽',
    currentProfit: '200 ₽',
    assets: '1500 ₽',
  },
  {
    photo: '/360fx360f2.png',
    name: 'Капсула с наклейками кандидатов PGL Major Copenhagen 2024 Капсула с наклейками кандидатов PGL Major Copenhagen 2024 Капсула с наклейками кандидатов PGL Major Copenhagen 2024 Капсула с наклейками кандидатов PGL Major Copenhagen 2024',
    price: '2000 ₽',
    attachments: '1000 ₽',
    currentPrice: '2200 ₽',
    currentProfit: '200 ₽',
    assets: '2500 ₽',
  },
  // Добавьте больше данных по необходимости
];

export const Home = () => {
  return (
    <>
      <Header />
      <InvestmentTable data={data} />
    </>
  );
};