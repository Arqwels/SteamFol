import { Navigation } from '../components/Navigation/Navigation';
import { Table } from '../components/Table/Table';
import { Footer } from '../components/Footer/Footer';
import { PortfolioHeader } from '../components/Portfolio/PortfolioHeader';
import { useActivatePortfolioMutation, useCreatePortfolioMutation, useDeletePortfolioMutation, useGetAllPortfolioQuery } from '../api/portfolioApi';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import { setActivePortfolio } from '../stores/reducers/activePortfolioSlice';
import { Loader } from '../components/Loader/Loader';
import { PortfolioModal } from '../components/PortfolioModal/PortfolioModal';

export const MainPage = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dispatch = useAppDispatch();
  const activeId = useAppSelector(state => state.activePortfolio.portfolioId);
  
  const { data: portfolios, isLoading: isLoadingAll } = useGetAllPortfolioQuery();
  const [activatePortfolio] = useActivatePortfolioMutation();
  const [createPortfolio] = useCreatePortfolioMutation();
  const [deletePortfolio] = useDeletePortfolioMutation();

  useEffect(() => {
    if (!portfolios?.length) return;
    const stillExists = portfolios.some(p => p.id === activeId);
    if (activeId == null || !stillExists) {
      const first = portfolios.find(p => p.isActive)?.id ?? portfolios[0].id;
      dispatch(setActivePortfolio(first));
    }
  }, [dispatch, portfolios, activeId]);

  const activeIndex = useMemo(() => {
    if (!portfolios || activeId == null) return 0;
    const idx = portfolios.findIndex(p => p.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [portfolios, activeId]);

  const handleTabChange = async (id: number) => {
    if (id == null) return;
    await activatePortfolio(id).unwrap();
    dispatch(setActivePortfolio(id));
  };
  
  const handleCreate = async (name: string) => {
    try {
      const newPortfolio = await createPortfolio({ namePortfolio: name }).unwrap();
      await activatePortfolio(newPortfolio.id).unwrap();
      dispatch(setActivePortfolio(newPortfolio.id));
      setIsAddOpen(false);
    } catch (error) {
      console.error('Ошибка при создании портфолио!', error);
    }
  };

  const handleDeleteAndActivate = async (deletedId: number) => {
    try {
      await deletePortfolio(deletedId).unwrap();
    } catch (error) {
      console.error('Ошибка при удалении портфеля:', error);
    }
  };

  if (isLoadingAll) return <Loader />;
  return (
    <main className='container'>
      <Navigation />
      <PortfolioHeader
        portfolios={portfolios ?? []}
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
        onAddClick={() => setIsAddOpen(true)}
        onDelete={(id) => handleDeleteAndActivate(id)}
      />
      <Table />
      <Footer />

      <PortfolioModal
        title='Новый портфель'
        initialName=''
        submitLabel='Создать'
        active={isAddOpen}
        setActive={setIsAddOpen}
        onSubmit={handleCreate}
      />
    </main>
  )
};
