import React from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './grid.module.css';

const GridSettings: React.FC<FCChildren> = ({ children }): JSX.Element => {
  return <div className={`${s.wrapper} ${s.settings_page}`}>{children}</div>;
};

export default GridSettings;
