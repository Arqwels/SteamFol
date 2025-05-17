import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import styles from './ConfirmModal.module.scss';
import PlusIcon from '../Svg/PlusIcon';

interface ConfirmModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<any> | void;
}

export const ConfirmModal = ({
  active,
  setActive,
  title = 'Подтвердите действие',
  message = 'Вы уверены, что хотите продолжить?',
  confirmLabel = 'Да',
  cancelLabel = 'Отмена',
  onConfirm,
}: ConfirmModalProps) => {
  const [isLoading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm?.();
      setActive(false);
    } catch (e) {
      console.error('Ошибка в ConfirmModal:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal active={active} setActive={setActive}>
      <div className={styles.confirmContainer}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button
            className={styles.cancelBtn}
            onClick={() => setActive(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? '...' : confirmLabel}
          </button>
        </div>
        <button className={styles.closeModal} onClick={() => setActive(false)}>
          <PlusIcon />
        </button>
      </div>
    </Modal>
  )
};
