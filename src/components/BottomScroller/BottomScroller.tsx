import React from 'react';
import s from './bottomscroller.module.css';

type Props = {
  scroll: () => void;
};

const BottomScroller: React.FC<Props> = ({ scroll }): JSX.Element => {
  return (
    <div className={s.wrapper} onClick={scroll}>
      <i className="fas fa-chevron-down"></i>
    </div>
  );
};

export default BottomScroller;
