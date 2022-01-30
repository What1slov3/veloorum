import React from 'react';
import s from './modalerror.module.css';

const ModalError: React.FC = ({ children }): JSX.Element => {
  return <div className={s.wrapper}>{children}</div>;
};

export default ModalError;
