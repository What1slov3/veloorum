import React from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './modalerror.module.css';

const ModalError: React.FC<FCChildren> = ({ children }): JSX.Element => {
  return <div className={s.wrapper}>{children}</div>;
};

export default ModalError;
