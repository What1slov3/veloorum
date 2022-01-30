import React from 'react';
import s from './tooltip.module.css';

const Tooltip: React.FC = ({children}): JSX.Element => {
  return (
    <div className={s.wrapper}>
      {children}
    </div>
  );
}

export default Tooltip;