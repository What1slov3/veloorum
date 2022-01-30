import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { kec } from '../../..';
import { setModalIsActive } from '../../../store/appdata';
import ModalOverlay from './ModalOverlay/ModalOverlay';
import s from './modalwindow.module.css';

// ? РУКОВОДСТВО
// * Используется для создания нового модального окна
// * В данный компонент помещаем "внутренности" модального окна
// * Для управления используем хук useModal args: (open, close, isOpen, isFading)

type TProps = {
  isFading: boolean;
  close: () => void;
  bgColor?: string;
};

const ModalWindow: React.FC<TProps> = ({ children, isFading, close, bgColor }): JSX.Element | null => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setModalIsActive(true));

    kec.add('onkeydown', 'modalOpening', (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    });

    return () => {
      kec.remove('onkeydown', 'modalOpening');
      dispatch(setModalIsActive(false));
    };
  }, []);

  return (
    <ModalOverlay isFading={isFading} onClick={close}>
      <div className={s.wrapper} id={isFading ? s.fading : undefined} style={{ background: bgColor }}>
        {children}
      </div>
    </ModalOverlay>
  );
};

export default ModalWindow;
