import React from 'react';
import Spacer from '../../../templates/Spacer';
import Avatar from '../../Avatar/Avatar';
import s from './channelmembercard.module.css';

type TProps = {
  username: string;
  avatar: string;
  icon?: JSX.Element;
  isAdmin?: boolean;
};

const ChannelMemberCard: React.FC<TProps> = ({ username, avatar, icon }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      <Avatar url={avatar} username={username} />
      <Spacer width={10} />
      <div className={s.username}>
        {username} <span className={s.icon}>{icon}</span>
      </div>
    </div>
  );
};

export default ChannelMemberCard;
