import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styles from './InvestmentTable.module.scss';
import { FC } from 'react';
import { InvestmentTableRowProps } from './types';
import investmentStore from '../../../stores/investmentStore';
import DashboardIcon from '../../Svg/DashboardIcon';
import { Modal } from '../../Modal/Modal';
import PlusIcon from '../../Svg/Footer/PlusIcon';
import { FloatingLabelInput } from '../../Common/FloatingLabelInput/FloatingLabelInput';

const truncateText = (text: string, maxLength: number): string => {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
};

export const InvestmentTableRow: FC<InvestmentTableRowProps & { isOpen: boolean; toggleMenu: (id: string) => void; closeMenu: () => void }> = observer(({ investment, isOpen, toggleMenu, closeMenu }) => {
  const { id, image_url, market_hash_name, market_name, price_item, buyPrice, countItems } = investment;

  const [modalEditActive, setModalEditActive] = useState(false);
  const [modalSellActive, setModalSellActive] = useState(false);

  const handleSell = () => {
    setModalSellActive(true); // Открытие модального окна продажи
    console.log("Продать", investment);
    closeMenu();
  };

  const handleEdit = () => {
    setModalEditActive(true); // Открытие модального окна редактирования
    closeMenu();
  };

  const handleDelete = () => {
    console.log("Удалить", investment);
    alert(`Вы уверены, что хотите удалить "${market_name}"!`);
    closeMenu();
  };


  useEffect(() => {
    if (!modalEditActive) {
      setBuyPriceSkinInputValue(buyPrice); // Сброс значений при закрытии модального окна
      setCountSkinInputValue(countItems);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(`.${styles.dashboardCell}`)) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };

    
  }, [closeMenu, modalEditActive, buyPrice, countItems]);

  const maxLength = 60;
  const profit = investmentStore.getInvestmentProfit(buyPrice, countItems, price_item);
  const netProfit = investmentStore.getNetProfit(buyPrice, countItems, price_item);
  const profitPercentage = ((price_item * countItems) - (buyPrice * countItems)) / (buyPrice * countItems) * 100;
  const profitClass = profit >= 0 ? styles.profitPositive : styles.profitNegative;

  const [ buyPriceSkinInputValue, setBuyPriceSkinInputValue ] = useState<string | number>(buyPrice);
  const [ countSkinInputValue, setCountSkinInputValue ] = useState<string | number>(countItems);

  // Всего вложений
  const totalSpent = (buyPrice * countItems);
  const [ totalSpentInputValue, setTotalSpentInputValue ] = useState<string | number>(totalSpent);

  return (
    <>
      <tr className={styles.trBody}>
        <td>
          <img src={image_url} alt={market_hash_name} className={styles.photo} />
        </td>
        <td>{truncateText(market_name, maxLength)}</td>
        <td>
          <p>{buyPrice}₽</p>
          <p>{countItems}шт.</p>
        </td>
        <td>{(totalSpent).toFixed(2)}₽</td> 
        <td>{price_item}₽</td>
        <td className={profitClass}>
          <p>{profit.toFixed(2)}₽ ({netProfit.toFixed(2)}₽)</p>
          <p>{profitPercentage.toFixed(2)}%</p>
        </td>
        <td className={styles.dashboardCell}>
          <p>{investmentStore.getTotalAssets(buyPrice, countItems, price_item).toFixed(2)}₽ ({investmentStore.getNetTotalAssets(buyPrice, countItems, price_item).toFixed(2)}₽)</p>
          <button className={styles.dashboard} onClick={() => toggleMenu(String(id))}>
            <DashboardIcon />
          </button>

          {isOpen && (
            <div className={styles.menu}>
              <button onClick={handleSell} className={styles.menuBtnSell}>Продать</button>
              <button onClick={handleEdit} className={styles.menuBtnEditor}>Редактировать</button>
              <button onClick={handleDelete} className={styles.menuBtnDelete}>Удалить</button>
            </div>
          )}
        </td>
      </tr>

      {/* Компонент Modal Edit */}
      <Modal active={modalEditActive} setActive={setModalEditActive}>
        <div className={styles.editorSkin}>
        <form>
          <h2 className={styles.skinName}>{market_name}</h2>

          <div className={styles.priceAndCount}>
            <FloatingLabelInput
              id='buyPriceSkin'
              label='Цена покупки'
              value={buyPriceSkinInputValue}
              onChange={setBuyPriceSkinInputValue}
            />

            <div className={styles.plusIcon}>
              <PlusIcon />
            </div>

            <FloatingLabelInput
              id='countSkin'
              label='Кол-во'
              value={countSkinInputValue}
              onChange={setCountSkinInputValue}
              style={{ maxWidth: '140px' }}
            />
          </div>

          <FloatingLabelInput
            id='totalSpent'
            label='Всего потрачено'
            value={totalSpentInputValue}
            onChange={setTotalSpentInputValue}
            disabled={true}
          />
          <button className={styles.saveData}>Сохранить</button>
        </form>

          {/* Кнопка для закрытия Модального окна */}
          <button className={styles.closeModal} onClick={() => setModalEditActive(false)}>
            <PlusIcon />
          </button>
        </div>
      </Modal>

      {/* Компонент Modal Sell */}
      <Modal active={modalSellActive} setActive={setModalSellActive}>
        <div>
          <form action="">
            <h2 className={styles.skinName}>{market_name}</h2>

          </form>

          {/* Кнопка для закрытия Модального окна */}
          <button className={styles.closeModal} onClick={() => setModalSellActive(false)}>
            <PlusIcon />
          </button>
        </div>
      </Modal>
    </>
  );
});
