import { useState } from 'react';
import style from './Header.module.scss';
import { SectionInfoInvest } from './SectionInfoInvest';
import { Modal } from '../../Modal/Modal';
import { FloatingLabelInput } from '../../Common/FloatingLabelInput/FloatingLabelInput';
// import searchService from "../../../services/searchService";

export const Header = () => {
  const [modalActive, setModalActive] = useState(false);
  // Добавить логику для получения информации о "Всего инвестировано", "Текущий баланс", "Общая прибыль"

  // const [searchQuery, setSearchQuery] = useState(""); // состояние для поискового запроса
  // const [searchTimeout, setSearchTimeout] = useState(false);


  // const searchHandler = (e) => {
  //   setSearchQuery(e.target.value)
  //   if (searchTimeout != false) {
  //     clearTimeout(searchTimeout)
  //   }
  //   setSearchTimeout(setTimeout(() => {
  //     searchService.search(searchQuery)
  //   }, 500))
  // }

  // const handleSearch = () => {
  //   console.log("Выполняем поиск...");
  //   searchSkins.search(); // Вызываем метод search у searchSkins
  // };

  const [ countItems, setCountItems ] = useState<number>(1);

  return (
    <div className={style.wrap}>
      <div className={style.containerInfoInvest}>
        <SectionInfoInvest money={0} text="Всего инвестировано" />
        <SectionInfoInvest money={2981.12} text="Текущий баланс" />
        <SectionInfoInvest money={1981.12} text="Общая прибыль" />
      </div>

      <button className={style.addNewItem} onClick={() => setModalActive(true)}>Добавить предмет</button>

      <Modal active={modalActive} setActive={setModalActive}>
        <div className={style.addSkin}>
          <input 
            type="text"
            placeholder="Поиск..."
            // value={searchQuery}
            // onChange={searchHandler}
          />

          {/* Нужно типа ниже поиска сделать выбор того что придёт через запрос */}


          <div className="countAndPrice">
            <FloatingLabelInput 
              id='count'
              label='Количество'
              value={countItems}
              onChange={setCountItems}
            />
            <label htmlFor="count">Количество</label>
            <input type="text" id="count"/>

            <label htmlFor="price">Цена покупки</label>
            <input type="text" id="price" />
          </div>

          <label htmlFor="totalSpent">Всего потрачено</label>
          <input type="text" id="totalSpent" />

          <button>Добавить</button>
        </div>
      </Modal>
    </div>
  );
};
