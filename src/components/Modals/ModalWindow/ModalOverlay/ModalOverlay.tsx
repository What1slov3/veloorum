import React, { useState } from 'react';
import s from './modaloverlay.module.css';

type TProps = {
  isFading: boolean;
  onClick: () => void;
};

const ModalOverlay: React.FC<TProps> = ({ children, isFading, onClick }): JSX.Element => {
  const [mouseDownWasOverlay, setMouseDownWasOverlay] = useState<boolean>(false);

  return (
    <div
      data-overlay="true"
      className={s.wrapper}
      id={isFading ? s.fading : undefined}
      onMouseDown={(e: any) => setMouseDownWasOverlay(!!e.target.dataset.overlay)}
      onMouseUp={(e: any) => {
        if (e.target.dataset.overlay && mouseDownWasOverlay) {
          onClick();
        }
        setMouseDownWasOverlay(false);
      }}
    >
      {children}
    </div>
  );
};

export default ModalOverlay;
