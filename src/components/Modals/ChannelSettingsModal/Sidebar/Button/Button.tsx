import React from 'react';
import SidebarButtonTemplate from '../../../../../templates/Buttons/SidebarButton/SidebarButtonTemplate';
import s from './button.module.css';

type Props = {
  title: string;
  isActive: boolean;
  onClick: () => void;
};

const Button: React.FC<Props> = ({ title, isActive, onClick }): JSX.Element => {
  return (
    <div className={s.wrapper} onClick={onClick}>
      <SidebarButtonTemplate isActive={isActive}>{title}</SidebarButtonTemplate>
    </div>
  );
};

export default Button;
