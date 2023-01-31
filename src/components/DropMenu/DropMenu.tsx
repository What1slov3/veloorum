import classNames from 'classnames';
import React, { CSSProperties, useEffect, useState } from 'react';
import { findDatasetInParents } from '@common/utils/findDataInParents';
import { FCChildren } from '@customTypes/common.types';
import s from './dropmenu.module.css';

type Props = {
  style?: CSSProperties;
  current: string | JSX.Element;
} & FCChildren;

const DropMenu: React.FC<Props> = ({ children, style, current }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onCloseDropMenuHandler(e: MouseEvent) {
      if (!findDatasetInParents(e.target as HTMLElement, 'dropmenu')) setIsOpen(false);
    }

    if (isOpen) {
      window.addEventListener('mousedown', onCloseDropMenuHandler);
    }

    return () => {
      window.removeEventListener('mousedown', onCloseDropMenuHandler);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [current]);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={classNames({ [s.wrapper]: true, [s.open]: isOpen })} style={style} data-dropmenu="true">
      <div className={s.current_value} onClick={onClick}>
        {current}
        <i className={`fas fa-chevron-down ${s.arrow}`}></i>
      </div>
      <div className={s.list}>{children}</div>
    </div>
  );
};

export default DropMenu;
