import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import SidebarButtonTemplate from '../../../templates/Buttons/SidebarButton/SidebarButtonTemplate';
import s from './sidebarbutton.module.css';

type Props = {
  title: string;
  url: string;
};

const SidebarButton: React.FC<Props> = ({ title, url }): JSX.Element => {
  return (
    <NavLink to={url} className={({ isActive }) => classNames({ [s.active]: isActive, [s.wrapper]: true })}>
      <SidebarButtonTemplate>{title}</SidebarButtonTemplate>
    </NavLink>
  );
};

export default SidebarButton;
