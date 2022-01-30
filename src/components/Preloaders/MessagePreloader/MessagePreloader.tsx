import React from 'react';
import s from './messagepreloader.module.css';

const MessagePreloader: React.FC = ({}): JSX.Element => {
  return (
    <div className={s.wrapper}>
      <div className={s.time_wrapper}>
        <div className={s.time}></div>
      </div>
      <div className={s.content_wrapper}>
        <div className={s.username}></div>
        <div className={s.content}>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreloader;
