import React from 'react';
import { FCChildren, FCStyle } from '@customTypes/common.types';
import s from './modalline.module.css';

type Props = FCChildren & FCStyle;

const ModalLine: React.FC<Props> = ({}): JSX.Element => {
  return <div className={s.line}></div>;
};

export default ModalLine;
