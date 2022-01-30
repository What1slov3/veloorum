import React from 'react';
import Spacer from '../../../templates/Spacer';
import s from './channelnavbar.module.css';

type TProps = {
  textChannelName: string;
};

const ChannelNavbar: React.FC<TProps> = ({ textChannelName }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      <div className={s.name}>
        <span>#</span>
        <Spacer width={10} />
        {textChannelName}
      </div>
    </div>
  );
};

export default ChannelNavbar;
