import React from 'react';
import s from './grid.module.css';

const GridSettings: React.FC = ({ children }): JSX.Element => {
  return <div className={`${s.wrapper} ${s.settings_page}`}>{children}</div>;
};

export default GridSettings;
