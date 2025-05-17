import { PortfolioTabs } from './PortfolioTabs';
import styles from './PortfolioHeader.module.scss';
import { FiPlus, FiSettings, FiShare2 } from 'react-icons/fi';
import { Portfolio } from '../../types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRenamePortfolioMutation } from '../../api/portfolioApi';
import { PortfolioModal } from '../PortfolioModal/PortfolioModal';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

interface PortfolioHeaderProps {
  portfolios: Portfolio[];
  activeIndex: number;
  onTabChange: (id: number) => void;
  onAddClick: () => void;
  onDelete: (id: number) => void;
}

export const PortfolioHeader = ({
  portfolios,
  activeIndex,
  onTabChange,
  onAddClick,
  onDelete
}: PortfolioHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renamePortfolio] = useRenamePortfolioMutation();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const activePortfolio = portfolios[activeIndex];
  const currentName = activePortfolio?.namePortfolio ?? '';

  const tabs = useMemo(() => {
    if (portfolios.length === 0) {
      return ['Local Portfolio'];
    }
    return portfolios.map(p => p.namePortfolio);
  }, [portfolios]);

  // Закрываем меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleOpenRename = () => {
    setSettingsOpen(false);
    setIsRenameOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
    setSettingsOpen(false);
  };

  const handleRename = async (newName: string) => {
    if (!activePortfolio) return;

    await renamePortfolio({
      id: activePortfolio.id,
      namePortfolio: newName
    }).unwrap();
    setSettingsOpen(false);
  };

  const confirmDelete = async () => {
    if (!activePortfolio) return;

    setSettingsOpen(false);
    setIsDeleteOpen(false);

    onDelete(activePortfolio.id);
  };

  return (
    <header className={styles.header}>
      <div className={styles.tabsContainer}>
        <PortfolioTabs
          items={tabs}
          activeIndex={activeIndex}
          onChange={(newIndex) => {
            // если локальный таб (нет портфелей) — просто не дергаем бэкенд
            if (portfolios.length === 0) return;
            onTabChange(portfolios[newIndex].id);
          }}
        />
        <button
          className={styles.newPortfolioBtn}
          onClick={onAddClick}
          type='button'
        >
          <FiPlus size={16} style={{ marginRight: 4 }} />
          Новый портфель
        </button>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconButton}
          onClick={() => console.log('Share')}
          type='button'
        >
          <FiShare2 size={20} />
        </button>

        {/* Блок с ref для Settings */}
        <div ref={settingsRef} className={styles.settingsWrapper}>
          <button
            className={styles.iconButton}
            onClick={e => {
              e.stopPropagation(); // чтобы не сразу считать клик «вне»
              setSettingsOpen(open => !open);
            }}
            type='button'
          >
            <FiSettings size={20} />
          </button>

          {settingsOpen && (
            <div className={styles.settingsMenu}>
              <button onClick={handleOpenRename} type='button'>
                Переименовать
              </button>
              <button onClick={handleDelete} type='button'>
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>

      <PortfolioModal
        title='Переименовать портфель'
        initialName={currentName}
        submitLabel='Сохранить'
        active={isRenameOpen}
        setActive={setIsRenameOpen}
        onSubmit={handleRename}
      />

      <ConfirmModal
        active={isDeleteOpen}
        setActive={setIsDeleteOpen}
        title='Удалить портфель?'
        message={`Портфель "${currentName}" будет удалён навсегда.`}
        confirmLabel='Удалить'
        cancelLabel='Отмена'
        onConfirm={confirmDelete}
      />
    </header>
  )
};
