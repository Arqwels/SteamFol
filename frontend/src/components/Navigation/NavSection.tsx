import React from 'react';
import style from './Navigation.module.scss';
import { ChangeClass } from '../../utils/getChangeClass';
import { formatNumber } from '../../utils/formatNumber';

interface ComponentProps {
  money: number;
  text: string;
  changeClass?: ChangeClass;
  isLoading?: boolean;
}

export const NavSection: React.FC<ComponentProps> = ({
  money,
  text,
  changeClass,
  isLoading = false,
}) => {
  const cls = [
    style.invest,
    changeClass ? style[changeClass] : '',
    isLoading ? style.skeletonWrapper : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={cls}>
      {isLoading ? (
        <>
          <div className={style.skeletonMoney} />
          <div className={style.skeletonText} />
        </>
      ) : (
        <>
          <p>
            {formatNumber(money, { currency: 'RUB' })}
          </p>
          <p>{text}</p>
        </>
      )}
    </section>
  )
};
