import React from 'react';
import style from './Header.module.scss';

interface ComponentProps {
  money: number;
  text: string;
}

export const SectionInfoInvest: React.FC<ComponentProps> = ({ money, text }) => {
  return (
    <section className={style.allInvest}>
      <p>{money} <span>₽</span></p>
      <p>{text}</p>
    </section>
  );
};
