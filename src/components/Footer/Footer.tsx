import { useState } from 'react';
import style from './Footer.module.scss';
import { Modal } from '../Modal/Modal';
import PlusIcon from '../Svg/Footer/PlusIcon';
import FooterPlus from '../Svg/Footer/FooterPlus';
import FooterGithub from '../Svg/Footer/FooterGithub';
import FooterInfo from '../Svg/Footer/FooterInfo';

export const Footer = () => {
  const [modalActive, setModalActive] = useState(false);

  // Функция для открытия Github по нажати на кнопку
  const openGithub = () => {
    window.open('https://github.com/Arqwels/SteamFol', '_blank');
  }

  return (
    <footer className={style.footer}>

      {/* Ввывод увведомления реализовать тут */}
      {/* <div className={style.notification}>
        <p>Добро пожаловать, мой господин</p>
        <button className={style.close}><img src="./symbols_close.svg" alt="close" /></button>
      </div> */}

      {/* Доделать что бы на кнопках был функционал */}
      <div className={style.buttons}>
        <button className={style.btn}>
          <FooterInfo />
        </button>
        <button className={`${style.btn} ${style.mainButton}`} onClick={() => setModalActive(true)} >
          <FooterPlus />
        </button> 
        <button className={style.btn} onClick={openGithub}>
          <FooterGithub />
        </button>
      </div>

      <Modal active={modalActive} setActive={setModalActive}>
        <div className={style.addSkin}>
          <input 
            type="text"
            placeholder="Поиск..."
            className={`${style.addSkinInput} ${style.search}`}
            // value={searchQuery}
            // onChange={searchHandler}
          />

          {/* Нужно типа ниже поиска сделать выбор того что придёт через запрос */}

          <div className={style.priceAndCount}>
            <input 
              type="text"
              placeholder="Цена покупки"
              className={style.addSkinInput}
            />

            <PlusIcon />

            <input 
              type="text"
              placeholder="Кол-во"
              className={style.addSkinInput}
            />
          </div>

          <input 
            type="text" 
            id="totalSpent" 
            placeholder="Всего потрачено"
            className={style.addSkinInput}
          />

          <button className={style.addSkinBtn}>Добавить</button>
          <button className={style.closeModal} onClick={() => setModalActive(false)}>
            <PlusIcon />
          </button>
        </div>
      </Modal>
    </footer>
  );
};
