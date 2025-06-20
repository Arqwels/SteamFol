import React, { useEffect, useId, useState } from 'react';
import { FaTag, FaSteam, FaSave } from 'react-icons/fa';
import { TableData } from '../../types';
import styles from './InvestItem.module.scss';
import { Modal } from '../Modal/Modal';
import PlusIcon from '../Svg/PlusIcon';
import { getChangeClass } from '../../utils/getChangeClass';

interface InvestItemProps {
  data: TableData;
  active: boolean;
  setActive: (active: boolean) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onSaveChanges?: (countItems: number, buyPrice: number) => void;
  onSell?: () => void;
}

export const InvestItem = ({
  data,
  active,
  setActive,
  isUpdating = false,
  isDeleting = false,
  onSaveChanges,
  onSell,
}: InvestItemProps) => {
  const {
    market_name,
    image_url,
    price_item,
    change_price_percent_24h,
    change_price_profit_24h,
    count_items,
    buy_price,
    currencyCode,
    market_hash_name,
  } = data;

  const idCount = useId();
  const idBuyPrice = useId();
  const [countItems, setCountItems] = useState<number>(count_items);
  const [buyPrice, setBuyPrice] = useState<number>(buy_price);

  const changeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCountItems(+value);
    }
  };

  const changeBuyPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBuyPrice(+value);
  };

  const formatPrice = (price: number) => {
    const formatted = price.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} ${currencyCode || 'RUB'}`;
  };

  useEffect(() => {
    if (active) {
      setCountItems(data.count_items);
      setBuyPrice(data.buy_price);
    }
  }, [active, data]);

  const cls = getChangeClass(change_price_percent_24h);

  return (
    <Modal active={active} setActive={setActive}>
      <div className={styles.wrapper}>
        {/* Блок с изображением */}
        <figure className={styles.imageWrapper}>
          <img src={image_url} alt={market_name} className={styles.image} />
          <figcaption className={styles.visuallyHidden}>{market_name}</figcaption>
        </figure>

        {/* Основное содержимое */}
        <div className={styles.content}>
          <h2 className={styles.title}>{market_name}</h2>

          <section>
            <hr className={styles.divider} />

            <p className={styles.price}>
              Текущая цена: <strong>{formatPrice(price_item)}</strong>
            </p>

            <hr className={styles.divider} />

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Изм. цены 24ч, %</span>
                <span className={`${styles.statValue} ${cls}`}>
                  {change_price_percent_24h.toFixed(2)}%
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Изм. прибыли 24ч</span>
                <span className={`${styles.statValue} ${cls}`}>
                  {formatPrice(change_price_profit_24h)}
                </span>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.info}>
              <div className={styles.infoGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    id={idCount}
                    name='count'
                    type='number'
                    placeholder=' '
                    className={styles.inputField}
                    value={countItems}
                    onChange={changeCount}
                    disabled={isUpdating}
                  />
                  <label htmlFor={idCount} className={styles.inputLabel}>Количество</label>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    id={idBuyPrice}
                    name='buyPrice'
                    type='number'
                    placeholder=' '
                    className={styles.inputField}
                    value={buyPrice}
                    onChange={changeBuyPrice}
                    disabled={isUpdating}
                  />
                  <label htmlFor={idBuyPrice} className={styles.inputLabel}>Цена покупки</label>
                </div>
              </div>

              <div className={styles.total}>
                <span className={styles.label}>Всего потрачено:</span>
                <span className={styles.value}>{formatPrice(Number(buyPrice) * Number(countItems))}</span>
              </div>
            </div>
          </section>

          <footer className={styles.actions}>
            <button
              onClick={() => onSaveChanges?.(countItems, buyPrice)}
              className={`${styles.button} ${styles.saveButton}`}
              disabled={isUpdating}
            >
              {isUpdating ? 'Сохраняем...' : <><FaSave /> Сохранить</>}
            </button>

            <a
              href={`https://steamcommunity.com/market/listings/730/${market_hash_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.steamButton}`}
            >
              <FaSteam /> Steam
            </a>

            <button
              onClick={() => onSell?.()}
              className={`${styles.button} ${styles.sellButton}`}
              disabled={isDeleting}
            >
              {isDeleting ? 'Продажа...' : <><FaTag /> Продать</>}
            </button>
          </footer>

          <button onClick={() => setActive(false)} className={styles.closeModal}>
            <PlusIcon />
          </button>
        </div>
      </div>
    </Modal>
  );
};
