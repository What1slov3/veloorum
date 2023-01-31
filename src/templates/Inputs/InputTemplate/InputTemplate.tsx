import React from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './inputtemplate.module.css';

type TProps = {
  shadow?: boolean;
} & FCChildren;

const InputTemplate: React.FC<TProps> = ({ children, shadow }): JSX.Element => {
  return <div className={`${s.wrapper} ${shadow ? s.shadow : undefined}`}>{children}</div>;
};

export default InputTemplate;
