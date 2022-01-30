import React from 'react';
import s from './grid.module.css';

const GridChannelPage: React.FC = ({ children }): JSX.Element => {
  return <div className={`${s.wrapper} ${s.channel_page}`}>{children}</div>;
};

export default GridChannelPage;
