import React, { CSSProperties } from 'react';
import s from './modalcontrol.module.css';

type TProps = {
  style?: CSSProperties;
};

const ModalControl: React.FC<TProps> = ({ style, children }): JSX.Element => {
  return (
    <div className={s.wrapper} style={style}>
      {children}
    </div>
  );
};

export default ModalControl;
