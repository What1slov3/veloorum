import classNames from 'classnames';
import React, { CSSProperties, useEffect, useState } from 'react';
import { kec } from '../..';
import s from './dropmenu.module.css';

type TProps = {
  style?: CSSProperties;
  current: string;
};

const findDatasetInParents = (elem: HTMLElement, data: string): boolean => {
  if (elem.dataset[data]) return true;
  if (elem.parentElement) return findDatasetInParents(elem.parentElement, data);
  return false;
};

const DropMenu: React.FC<TProps> = ({ children, style, current }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      kec.add('onmousedown', 'closeDropMenu', (e: any) => {
        if (!findDatasetInParents(e.target, 'dropmenu')) setIsOpen(false);
      });
    } else {
      kec.remove('onmousedown', 'closeDropMenu');
    }

    return () => {
      kec.remove('onmousedown', 'closeDropMenu');
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [current]);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={classNames({ [s.wrapper]: true, [s.open]: isOpen })} data-dropmenu="true">
      <div className={s.current_value} onClick={onClick}>
        {current}
        <i className={`fas fa-chevron-down ${s.arrow}`}></i>
      </div>
      <div className={s.list}>{children}</div>
    </div>
  );
};

export default DropMenu;
