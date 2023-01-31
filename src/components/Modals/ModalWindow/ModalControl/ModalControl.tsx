import React from 'react';
import { FCChildren, FCStyle } from '@customTypes/common.types';
import s from './modalcontrol.module.css';

type Props = FCChildren & FCStyle;

const ModalControl: React.FC<Props> = ({ style, children }): JSX.Element => {
  return (
    <div className={s.wrapper} style={style}>
      {children}
    </div>
  );
};

export default ModalControl;
