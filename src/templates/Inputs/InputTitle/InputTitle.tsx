import React, { CSSProperties } from 'react';
import s from './inputtitle.module.css';

type TProps = {
  style?: CSSProperties;
};

const InputTitle: React.FC<TProps> = ({ children, style }): JSX.Element => {
  return (
    <div className={s.wrapper} style={style}>
      {children}
    </div>
  );
};

export default InputTitle;
