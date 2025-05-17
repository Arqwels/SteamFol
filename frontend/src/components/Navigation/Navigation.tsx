import { skipToken } from '@reduxjs/toolkit/query';
import { useGetInvestmentsQuery } from '../../api/investmentApi';
import { mockInvestments } from '../../mocks/mockApiInvestments';
import { useAppSelector } from '../../stores/hooks';
import { COMMISSION_RATE } from '../../utils/config';
import { getChangeClass } from '../../utils/getChangeClass';
import { NavSection } from './NavSection';
import style from './Navigation.module.scss';
import { calcAssets, calcAssetsNet, calcCurrentProfitNet, calcInvest } from '../../utils/calculations';

export const Navigation = () => {
  const portfolioId = useAppSelector(state => state.activePortfolio.portfolioId);
  const { data, isLoading, error } = useGetInvestmentsQuery(portfolioId ?? skipToken);
  const investments = (!data || !!error) ? mockInvestments : data!;

  // Рассчитываем общую сумму вложений (количество * цена покупки)
  const totalInvested = investments.reduce(
    (sum, inv) => sum + calcInvest(inv.countItems, inv.buyPrice),
    0
  );

  // Рассчитываем текущую стоимость портфеля (количество * текущая цена скина)
  const currentBalance = investments.reduce(
    (sum, inv) => sum + calcAssets(inv.skin.price_skin, inv.countItems),
    0
  );

  const netProfit = investments.reduce(
    (sum, inv) => {
      const invested = calcInvest(inv.countItems, inv.buyPrice);
      const assets = calcAssets(inv.skin.price_skin, inv.countItems);
      const assetsNet = calcAssetsNet(assets, COMMISSION_RATE);
      const profitNet = calcCurrentProfitNet(assets, assetsNet, invested);
      return sum + profitNet;
    },
    0
  );

  // Класс для стилизации цвета прибыли/убытка/нейтрального
  const profitClass = getChangeClass(netProfit);

  return (
    <div className={style.navigation}>
      <NavSection
        money={totalInvested}
        text={'Всего инвестировано'}
        isLoading={isLoading}
      />
      <NavSection 
        money={currentBalance}
        text={'Текущий баланс'}
        isLoading={isLoading}
      />
      <NavSection 
        money={netProfit}
        //! При наведении показать пояснение, что расчёт прибыли учитывает комиссию
        text={`Общая прибыль (−${(COMMISSION_RATE*100).toFixed(2)}%)`}
        changeClass={profitClass}
        isLoading={isLoading}
      />
    </div>
  )
};
