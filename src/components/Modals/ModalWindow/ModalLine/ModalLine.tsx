import React, { CSSProperties } from 'react';
import s from './modalline.module.css';

type TProps = {
  style?: CSSProperties;
}

const ModalLine: React.FC<TProps> = ({}): JSX.Element => {
  return (
    <div className={s.line}></div>
  );
}

export default ModalLine;