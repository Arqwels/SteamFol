import style from "./Header.module.scss";
import { SectionInfoInvest } from "./SectionInfoInvest";

export const Header = () => {
  // Добавить логику для получения информации о "Всего инвестировано", "Текущий баланс", "Общая прибыль"
  return (
    <div className={style.wrap}>
      <div className={style.containerInfoInvest}>
        <SectionInfoInvest money={0} text="Всего инвестировано" />
        <SectionInfoInvest money={2981.12} text="Текущий баланс" />
        <SectionInfoInvest money={1981.12} text="Общая прибыль" />
      </div>

      <button className={style.addNewItem}>Добавить предмет</button>
    </div>
  );
};
