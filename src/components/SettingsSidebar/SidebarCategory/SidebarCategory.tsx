import React from 'react';
import Spacer from '../../../templates/Spacer';
import s from './sidebarcategory.module.css';

type TProps = {
  title: string;
};

const SidebarCategory: React.FC<TProps> = ({ title, children }): JSX.Element => {
  return (
    <div>
      <div className={s.title}>{title}</div>
      <Spacer height={5} />
      <div className={s.button_list}>{children}</div>
    </div>
  );
};

export default SidebarCategory;
