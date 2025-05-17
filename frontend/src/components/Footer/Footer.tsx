import { useState } from 'react';
import style from './Footer.module.scss';
import FooterPlus from '../Svg/Footer/FooterPlus';
import FooterGithub from '../Svg/Footer/FooterGithub';
import FooterInfo from '../Svg/Footer/FooterInfo';
import { AddSkin } from '../AddSkin/AddSkin';
import { GITHUB_REPOSITORY_URL } from '../../utils/config';

export const Footer = () => {
  const [modalActive, setModalActive] = useState(false);

  // Функция для открытия Github по нажати на кнопку
  const openGithub = () => {
    window.open(GITHUB_REPOSITORY_URL, '_blank');
  };

  return (
    <footer className={style.footer}>
      <div className={style.buttons}>
        <button className={style.btn}>
          <FooterInfo />
        </button>
        <button
          className={`${style.btn} ${style.mainButton}`}
          onClick={() => setModalActive(true)}
        >
          <FooterPlus />
        </button> 
        <button className={style.btn} onClick={openGithub}>
          <FooterGithub />
        </button>
      </div>

      <AddSkin active={modalActive} setActive={setModalActive} />
    </footer>
  )
};
