import React from 'react';
import { FCChildren, FCStyle } from '@customTypes/common.types';
import s from './sidebarbutton.module.css';

type TProps = {
  isActive?: boolean;
} & FCStyle &
  FCChildren;

const SidebarButtonTemplate: React.FC<TProps> = ({ children, style, isActive }): JSX.Element => {
  return (
    <div className={s.wrapper} id={isActive ? s.active : undefined}>
      {children}
    </div>
  );
};

export default SidebarButtonTemplate;
