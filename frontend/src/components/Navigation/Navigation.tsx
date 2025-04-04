import { NavSection } from './NavSection';
import style from './Navigation.module.scss';

export const Navigation = () => {
  return (
    <div className={style.navigation}>
      <NavSection
        money={0}
        text={"Всего инвестировано"}
      />
      <NavSection 
        money={0}
        text={"Текущий баланс"}
      />
      <NavSection 
        money={0}
        text={"Общая прибыль"}
      />
    </div>
  )
}
