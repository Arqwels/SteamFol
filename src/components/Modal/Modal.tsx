import { createPortal } from 'react-dom';
import style from './Modal.module.scss';
import { ReactNode, FC } from 'react';

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ active, setActive, children }) => {
  const modalElement = document.getElementById('modal');

  if (!modalElement) return null;

  return createPortal(
    (
      <div className={active ? `${style.modal} ${style.active}` : `${style.modal}`} onClick={() => setActive(false)}>
        <div className={active ? `${style.modal__content} ${style.active}` : `${style.modal__content}`} onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    ),
    modalElement
  );
};
