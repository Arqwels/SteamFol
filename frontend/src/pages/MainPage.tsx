import { Navigation } from '../components/Navigation/Navigation';
import { Table } from '../components/Table/Table';
import { Footer } from '../components/Footer/Footer';

export const MainPage = () => {
  return (
    <main className='container'>
      <Navigation />
      <Table />
      <Footer />
    </main>
  )
};
