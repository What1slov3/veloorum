import React from 'react';
import { LoadedUser } from '@customTypes/redux/users.types';
import Avatar from '@components/Avatar/Avatar';
import s from './usercard.module.css';

type Props = {
  user: LoadedUser;
};

const UserCard: React.FC<Props> = ({ user }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      <div className={s.main_info}>
        <Avatar url={user.avatarUrl} username={user.username} style={{ width: '80px', height: '80px' }} />
        <div className={s.username}>{user.username}</div>
      </div>
    </div>
  );
};

export default UserCard;
