import React from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './sidebarcategory.module.css';

type Props = {
  title: string;
} & FCChildren;

const SidebarCategory: React.FC<Props> = ({ title, children }): JSX.Element => {
  return (
    <div>
      <div className={s.title}>{title}</div>
      <div className={s.button_list}>{children}</div>
    </div>
  );
};

export default SidebarCategory;
