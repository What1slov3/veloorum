import React from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './tooltipbox.module.css';

const TooltipBox: React.FC<FCChildren> = ({ children }): JSX.Element => {
  return <div className={s.wrapper}>{children}</div>;
};

export default TooltipBox;
