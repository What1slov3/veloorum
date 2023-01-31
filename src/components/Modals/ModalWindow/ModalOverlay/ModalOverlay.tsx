import React, { useState } from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './modaloverlay.module.css';

type Props = {
  isFading: boolean;
  onClose: () => void;
} & FCChildren;

const ModalOverlay: React.FC<Props> = ({ children, onClose, isFading }): JSX.Element => {
  const [mouseDownWasOverlay, setMouseDownWasOverlay] = useState<boolean>(false);

  const mouseDownHandler = (e: any) => {
    setMouseDownWasOverlay(!!e.target.dataset.overlay);
  };

  const mouseUpHandler = (e: any) => {
    if (e.target.dataset.overlay && mouseDownWasOverlay) {
      onClose();
    }
    setMouseDownWasOverlay(false);
  };

  return (
    <div
      data-overlay="true"
      className={s.wrapper}
      id={isFading ? s.fading : undefined}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
    >
      {children}
    </div>
  );
};

export default ModalOverlay;
