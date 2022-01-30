import React, { CSSProperties } from 'react';
import s from './modalheader.module.css';

type TProps = {
  style?: CSSProperties
}

const ModalHeader: React.FC<TProps> = ({children, style}): JSX.Element => {
  return (
    <div className={s.wrapper} style={style}>
      {children}
    </div>
  );
}

export default ModalHeader;