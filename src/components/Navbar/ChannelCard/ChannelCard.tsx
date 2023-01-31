import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Avatar from '@components/Avatar/Avatar';
import { setActiveChannelId } from '@store/appdata/index';
import classNames from 'classnames';
import s from './channelcard.module.css';

type Props = {
  uuid: string;
  mainChatId: string;
  channelName: string;
  type: string;
  iconUrl: string;
  onlineCount: number;
  usersCount: number;
  onClick: () => void;
  isActive: boolean;
};

const ChannelCard: React.FC<Props> = ({
  uuid,
  channelName,
  type,
  iconUrl,
  onlineCount,
  usersCount,
  mainChatId,
  onClick,
  isActive,
}): JSX.Element => {
  return (
    <NavLink
      to={`/channel/${uuid}/${mainChatId}`}
      onClick={onClick}
      className={classNames({ [s.wrapper]: true, [s.active_channel]: isActive })}
    >
      <Avatar url={iconUrl} />
      <div className={s.channel_info}>
        <div className={s.channel_name}>{channelName}</div>
        <div className={s.online_wrapper}>
          <div className={s.count}>
            <span>{usersCount} </span>
            {usersCount === 1 ? 'участник' : usersCount > 1 && usersCount < 5 ? 'участника' : 'участников'}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ChannelCard;
