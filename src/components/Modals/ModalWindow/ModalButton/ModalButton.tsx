import React from 'react';
import { FCChildren, FCStyle } from '@customTypes/common.types';
import s from './modalbutton.module.css';

type Props = {
  onClick: () => void;
} & FCChildren &
  FCStyle;

const ModalButton: React.FC<Props> = ({ children, style, onClick }): JSX.Element => {
  return (
    <div className={s.wrapper} style={style} onClick={onClick}>
      {children}
    </div>
  );
};

export default ModalButton;
