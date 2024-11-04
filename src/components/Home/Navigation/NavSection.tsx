import React from 'react';
import style from './Navigation.module.scss';

interface ComponentProps {
  money: number;
  text: string;
}

export const NavSection: React.FC<ComponentProps> = ({ money, text }) => {
  return (
    <section className={style.invest}>
      <p>{money}<span>₽</span></p>
      <p>{text}</p>
    </section>
  );
};
