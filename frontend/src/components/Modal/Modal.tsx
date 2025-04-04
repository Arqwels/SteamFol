import { createPortal } from 'react-dom';
import style from './Modal.module.scss';
import { ReactNode, FC, useRef } from 'react';

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ active, setActive, children }) => {
  const modalElement = document.getElementById('modal');
  const mouseDownTargetRef = useRef<EventTarget | null>(null);

  if (!modalElement) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTargetRef.current = e.target;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseDownTargetRef.current === e.currentTarget) {
      setActive(false);
    }
    mouseDownTargetRef.current = null;
  };

  return createPortal(
    <div
      className={active ? `${style.modal} ${style.active}` : style.modal}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className={active ? `${style.modal__content} ${style.active}` : style.modal__content}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    modalElement
  );
};
