import React from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './grid.module.css';

const GridMain: React.FC<FCChildren> = ({ children }): JSX.Element => {
  return <div className={`${s.wrapper} ${s.main}`}>{children}</div>;
};

export default GridMain;
