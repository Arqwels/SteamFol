import { useGetInvestmentsQuery } from '../../api/investmentApi';
import { mockInvestments } from '../../mocks/mockInvestments';
import { COMMISSION_RATE } from '../../utils/config';
import { getChangeClass } from '../../utils/getChangeClass';
import { NavSection } from './NavSection';
import style from './Navigation.module.scss';

export const Navigation = () => {
  const { data, isLoading, error } = useGetInvestmentsQuery();
  const investments = (!data || !!error) ? mockInvestments : data!;

  // Рассчитываем общую сумму вложений (количество * цена покупки)
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.countItems * inv.buyPrice,
    0
  );

  // Рассчитываем текущую стоимость портфеля (количество * текущая цена скина)
  const currentBalance = investments.reduce(
    (sum, inv) => sum + inv.countItems * inv.skin.price_skin,
    0
  );

  const netProfit = +(currentBalance - totalInvested - (currentBalance - totalInvested) * COMMISSION_RATE).toFixed(2);

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
