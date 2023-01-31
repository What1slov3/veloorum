import React, { CSSProperties } from 'react';
import { FCChildren, FCStyle } from '@customTypes/common.types';
import s from './inputtitle.module.css';

type TProps = FCChildren & FCStyle;

const InputTitle: React.FC<TProps> = ({ children, style }): JSX.Element => {
  return (
    <div className={s.wrapper} style={style}>
      {children}
    </div>
  );
};

export default InputTitle;
