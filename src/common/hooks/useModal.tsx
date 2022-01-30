import React, { useState } from 'react';
import { TModalOpenFunc } from '../../types/hooks';

// ? ДОКУМЕНТАЦИЯ
// Используем для управления состоянием модального окна
// Можно передать generic и payload функции, если модальному окну нужна какая-то информация
// если нет возможности напрямую ее передать

const useModal = <T,>(
  initPayload: any = undefined
): {
  open: TModalOpenFunc<T>;
  close: () => void | Function;
  isOpen: boolean;
  isFading: boolean;
  payload: T | undefined;
} => {
  const [isFading, setIsFading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<T | undefined>(initPayload);

  const open = (newPayload: T | undefined) => {
    if (newPayload) setPayload(newPayload);
    setIsOpen(true);
  };

  const close = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsFading(false);
    }, 300);
  };

  return { open, close, isOpen, isFading, payload };
};

export default useModal;
