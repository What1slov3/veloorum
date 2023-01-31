import React from 'react';
import { FCChildren, FCStyle } from '@customTypes/common.types';
import s from './modalinputtitle.module.css';

type Props = FCChildren & FCStyle;

const ModalInputTitle: React.FC<Props> = ({ children, style }): JSX.Element => {
  return (
    <div className={s.wrapper} style={style}>
      {children}
    </div>
  );
};

export default ModalInputTitle;
