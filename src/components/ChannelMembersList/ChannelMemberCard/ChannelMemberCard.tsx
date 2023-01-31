import React from 'react';
import { User } from '@customTypes/redux/user.types';
import Avatar from '@components/Avatar/Avatar';
import s from './channelmembercard.module.css';

type Props = {
  icon?: JSX.Element;
  isAdmin?: boolean;
} & Pick<User, 'avatarColor' | 'avatarUrl' | 'username'>;

const ChannelMemberCard: React.FC<Props> = ({ username, avatarUrl, icon, avatarColor }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      <Avatar url={avatarUrl} username={username} avatarColor={avatarColor} />
      <div className={s.username}>{username}</div>
      <div className={s.icon}>{icon}</div>
    </div>
  );
};

export default ChannelMemberCard;
