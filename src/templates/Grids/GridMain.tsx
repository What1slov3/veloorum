import React from 'react';
import s from './grid.module.css';

const GridMain: React.FC = ({ children }): JSX.Element => {
  return <div className={`${s.wrapper} ${s.main}`}>{children}</div>;
};

export default GridMain;
