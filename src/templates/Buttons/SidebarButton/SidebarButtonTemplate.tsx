import React, { CSSProperties } from 'react';
import s from './sidebarbutton.module.css';

type TProps = {
  style?: CSSProperties;
  isActive?: boolean;
};

const SidebarButtonTemplate: React.FC<TProps> = ({ children, style, isActive }): JSX.Element => {
  return (
    <div className={s.wrapper} id={isActive ? s.active : undefined}>
      {children}
    </div>
  );
};

export default SidebarButtonTemplate;
