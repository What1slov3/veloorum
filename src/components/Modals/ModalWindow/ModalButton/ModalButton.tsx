import React, { CSSProperties, useEffect } from 'react';
import { kec } from '../../../..';
import s from './modalbutton.module.css';

type TProps = {
  style?: CSSProperties;
  onClick: () => void;
  onEnterPress?: boolean;
};

const ModalButton: React.FC<TProps> = ({ children, style, onClick, onEnterPress }): JSX.Element => {
  useEffect(() => {
    kec.add('onkeydown', 'pressEnter', (e: any) => {
      if (e.key === 'Enter') onClick();
    });

    return () => {
      kec.remove('onkeydown', 'pressEnter');
    };
  }, [onEnterPress, onClick]);

  return (
    <div className={s.wrapper} style={style} onClick={onClick}>
      {children}
    </div>
  );
};

export default ModalButton;
