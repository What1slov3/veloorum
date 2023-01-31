import React from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './grid.module.css';

const GridChannelPage: React.FC<FCChildren> = ({ children }): JSX.Element => {
  return <div className={`${s.wrapper} ${s.channel_page}`}>{children}</div>;
};

export default GridChannelPage;
