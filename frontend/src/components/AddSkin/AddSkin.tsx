import { useState, useEffect, useRef } from 'react';
import styles from './AddSkin.module.scss';
import PlusIcon from '../Svg/PlusIcon';
import { FloatingLabelInput } from '../Common/FloatingLabelInput/FloatingLabelInput';
import { Modal } from '../Modal/Modal';
import { useSearchQuery, ISkin } from '../../api/searchApi';
import { useDebounce } from '../../hooks/useDebounce';

interface AddSkinProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

export const AddSkin = ({ active, setActive }: AddSkinProps) => {
  const [ purchasePrice, setPurchasePrice ] = useState<number | null>(null);
  const [ countItems, setCountItems ] = useState<number | null>(null);
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ selectedSkin, setSelectedSkin ] = useState<ISkin | null>(null);
  const [ showResults, setShowResults ] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: searchResults, error, isLoading } = useSearchQuery(debouncedSearchQuery, {
    skip: debouncedSearchQuery.trim() === '',
  });

  // Обработчик выбора скина
  const handleSkinSelect = (skin: ISkin) => {
    setSearchQuery(skin.market_name);
    setSelectedSkin(skin);
    setShowResults(false);
  };

  const totalSpent = purchasePrice && countItems
    ? (purchasePrice * countItems).toFixed(2).replace('.', ',')
    : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, []);

  // Рендер списка поиска
  const renderSearchResults = () => {
    if (isLoading) return <p className={styles.statusMessage}>Загрузка...</p>;
    if (error) return <p className={styles.statusMessage}>Ошибка загрузки</p>;
    
    if (searchResults?.length) {
      return (
        <ul className={styles.resultsList}>
          {searchResults.map((skin) => (
            <li 
              key={skin.id} 
              className={styles.resultItem}
              onClick={() => handleSkinSelect(skin)}
            >
              <img src={skin.image_url} alt={skin.market_name} className={styles.skinImage} />
              <span className={styles.skinName}>{skin.market_name}</span>
            </li>
          ))}
        </ul>
      );
    }

    return searchQuery.trim() ? <p className={styles.statusMessage}>Ничего не найдено</p> : null;
  };

  // Отправка формы
  const handleSubmit = () => {
    if (selectedSkin && purchasePrice && countItems) {
      console.log('Данные для отправки:', { selectedSkin, purchasePrice, countItems, totalSpent });
      setActive(false);
      setSearchQuery('');
      setSelectedSkin(null);
      setPurchasePrice(null);
      setCountItems(null);
      setShowResults(false);
    }
  };

  return (
    <Modal active={active} setActive={setActive}>
      <div className={styles.addSkin}>
        <div className={styles.searchBlock} ref={searchRef}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Поиск скинов..."
              className={styles.addSkinInput}
              value={searchQuery}
              autoComplete="off"
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                setShowResults(!!value.trim()); // Показывать только если есть текст
              
                if (!value.trim()) {
                  setSelectedSkin(null); // Очистка выбранного скина при пустом вводе
                }
              }}
              onFocus={() => {
                // Если поле не пустое и скин ещё не выбран, показываем список
                if (searchQuery.trim() && !selectedSkin) {
                  setShowResults(true);
                }
              }}
            />
            {showResults && <div className={styles.searchResults}>{renderSearchResults()}</div>}
          </div>
        </div>

        <div className={styles.priceAndCount}>
          <FloatingLabelInput
            id="purchasePrice"
            label="Цена покупки"
            value={purchasePrice}
            onChange={setPurchasePrice}
            type="decimal"
            decimalPlaces={2}
            style={{ minWidth: '180px' }}
          />
          <PlusIcon />
          <FloatingLabelInput
            id="count"
            label="Количество"
            value={countItems}
            onChange={setCountItems}
            type="integer"
          />
        </div>

        <div className={styles.wrapTotalSpent}>
          <input
            type="text"
            id="totalSpent"
            placeholder=" "
            value={totalSpent}
            className={`${styles.addSkinInput} ${styles.noFocusOutline}`}
            readOnly
            tabIndex={-1}
          />
          <label
            htmlFor="totalSpent"
            className={`${styles.labelTotalSpent} ${totalSpent ? styles.labelFocused : ''}`}
          >
            Всего потрачено
          </label>
        </div>

        <button className={styles.addSkinBtn} onClick={handleSubmit} disabled={!selectedSkin || !purchasePrice || !countItems}>
          Добавить
        </button>
        <button className={styles.closeModal} onClick={() => setActive(false)}>
          <PlusIcon />
        </button>
      </div>
    </Modal>
  );
};
