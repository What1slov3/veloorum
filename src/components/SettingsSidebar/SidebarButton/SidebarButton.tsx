import React from 'react';
import { NavLink } from 'react-router-dom';
import SidebarButtonTemplate from '../../../templates/Buttons/SidebarButton/SidebarButtonTemplate';
import s from './sidebarbutton.module.css';

type TProps = {
  title: string;
  url: string;
};

const SidebarButton: React.FC<TProps> = ({ title, url }): JSX.Element => {
  return (
    <NavLink to={url} className={s.wrapper} activeClassName={s.active}>
      <SidebarButtonTemplate>{title}</SidebarButtonTemplate>
    </NavLink>
  );
};

export default SidebarButton;
