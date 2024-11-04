import { FC, useState } from 'react';
import { InvestmentTableProps } from './types';
import { InvestmentTableRow } from './InvestmentTableRow';
import styles from './InvestmentTable.module.scss';

import ImageIcon from '../../Svg/InvestmentIcon/ImageIcon';
import NameIcon from '../../Svg/InvestmentIcon/NameIcon';
import PriceIcon from '../../Svg/InvestmentIcon/PriceIcon';
import InvestmentIcon from '../../Svg/InvestmentIcon/InvestmentIcon';
import CurrentPriceIcon from '../../Svg/InvestmentIcon/CurrentPriceIcon';
import ProfitIcon from '../../Svg/InvestmentIcon/ProfitIcon';
import AssetsIcon from '../../Svg/InvestmentIcon/AssetsIcon';

export const InvestmentTable: FC<InvestmentTableProps> = ({ data }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleMenu = (menuId: number) => {
    setOpenMenuId(prev => (prev === menuId ? null : menuId));
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th><ImageIcon /> Фото</th>
          <th><NameIcon /> Название</th>
          <th><PriceIcon /> Цена покупки</th>
          <th><InvestmentIcon /> Вложения</th>
          <th><CurrentPriceIcon /> Текущая цена</th>
          <th><ProfitIcon /> Текущая прибыль</th>
          <th><AssetsIcon /> Активы</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <InvestmentTableRow
            key={index}
            investment={item}
            isOpen={openMenuId === item.id}
            toggleMenu={() => toggleMenu(item.id)}
            closeMenu={closeMenu}
          />
        ))}
      </tbody>
    </table>
  );
};
