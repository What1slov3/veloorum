import React, { CSSProperties } from 'react';
import s from './modalinputtitle.module.css';

type TProps = {
  style?: CSSProperties;
};

const ModalInputTitle: React.FC<TProps> = ({ children, style }): JSX.Element => {
  return (
    <div className={s.wrapper} style={style}>
      {children}
    </div>
  );
};

export default ModalInputTitle;
