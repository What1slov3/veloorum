import React from 'react';
import s from './bottomscroller.module.css';

type TProps = {
  scroll: () => void;
};

const BottomScroller: React.FC<TProps> = ({scroll}): JSX.Element => {
  return (
    <div className={s.wrapper} onClick={scroll}>
      <i className="far fa-chevron-down"></i>
    </div>
  );
};

export default BottomScroller;
