import React from 'react';
import s from './channelnavbar.module.css';

type Props = {
  textChannelName: string;
};

const ChannelNavbar: React.FC<Props> = ({ textChannelName }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      <div className={s.name}>
        <span>#</span>
        {textChannelName}
      </div>
    </div>
  );
};

export default ChannelNavbar;
