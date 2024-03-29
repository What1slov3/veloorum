import React, { Dispatch, SetStateAction } from 'react';
import Button from './Button/Button';
import s from './sidebar.module.css';

type Props = {
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
};

const Sidebar: React.FC<Props> = ({ activeCategory, setActiveCategory }): JSX.Element => {
  const isActiveCompare = (route: string) => {
    return activeCategory === route;
  };

  return (
    <div className={s.wrapper}>
      <Button title="Основное" isActive={isActiveCompare('main')} onClick={() => setActiveCategory('main')} />
    </div>
  );
};

export default Sidebar;
