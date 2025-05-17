import { createPortal } from 'react-dom';
import style from './Modal.module.scss';
import { ReactNode, FC, useRef, useEffect } from 'react';

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ active, setActive, children }) => {
  const modalElement = document.getElementById('modal');
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseDownTargetRef = useRef<EventTarget | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Сохраняем элемент, который был в фокусе до открытия модалки
  useEffect(() => {
    if (active && document.activeElement instanceof HTMLElement) {
      previouslyFocusedElement.current = document.activeElement;
    }
  }, [active]);

  // Блокировка скролла страницы
  useEffect(() => {
    if (active) {
      const prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = '';
      };
    }
  }, [active]);

  // Обрабатываем Tab и Escape, а также восстанавливаем фокус при закрытии
  useEffect(() => {
    if (!active) {
      // При закрытии: восстанавливаем фокус
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
      return;
    }

    const getFocusable = () => {
      if (!contentRef.current) return [] as HTMLElement[];
      return Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusableEls = getFocusable();
      if (!focusableEls.length) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];
      const isInside = contentRef.current?.contains(document.activeElement);

      // Если фокус снаружи — первый Tab переводит внутрь, Shift+Tab — на последний
      if (!isInside) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      // Зацикливание внутри модалки
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, setActive]);

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
      aria-hidden={!active}
    >
      <div
        ref={contentRef}
        className={active ? `${style.modal__content} ${style.active}` : style.modal__content}
        onMouseDown={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    modalElement
  )
};
