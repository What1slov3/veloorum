import classNames from 'classnames';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModal } from '@store/appdata';
import { FCChildren } from '@customTypes/common.types';
import ModalOverlay from './ModalOverlay/ModalOverlay';
import s from './modalwindow.module.css';

// ? РУКОВОДСТВО
// * Используется для создания нового модального окна
// * В данный компонент помещаем содержимое модального окна
// * Для управления используем хук useModal args: (open, close, isOpen, isFading)

type Props = {
  bgColor?: string;
  bottomShadow?: boolean;
} & FCChildren;

const ModalWindow: React.FC<Props> = ({ children, bgColor, bottomShadow = true }): JSX.Element | null => {
  const dispatch = useDispatch<any>();

  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    function onModalOpeningHandler(e: KeyboardEvent) {
      e.code === 'Escape' && closeModal();
    }

    document.addEventListener('keydown', onModalOpeningHandler);

    return () => {
      document.removeEventListener('keydown', onModalOpeningHandler);
      closeModal();
    };
  }, []);

  const closeModal = useCallback(() => {
    {
      setIsFading(true);
      setTimeout(() => {
        dispatch(setModal({ name: null, payload: {} }));
      }, 200);
    }
  }, []);

  return (
    <ModalOverlay isFading={isFading} onClose={closeModal}>
      <div
        className={classNames({ [s.wrapper]: true, [s.bottom_shadow]: bottomShadow })}
        id={isFading ? s.fading : undefined}
        style={{ background: bgColor }}
      >
        {React.cloneElement(children as ReactElement, { onClose: closeModal })}
      </div>
    </ModalOverlay>
  );
};

export default ModalWindow;
