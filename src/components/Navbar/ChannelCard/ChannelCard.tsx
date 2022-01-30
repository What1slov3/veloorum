import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Spacer from '../../../templates/Spacer';
import Avatar from '../../Avatar/Avatar';
import { setActiveChannelId } from '../../../store/appdata/index';
import s from './channelcard.module.css';

type TProps = {
  uuid: string;
  channelName: string;
  type: string;
  iconUrl: string;
  onlineCount: number;
  usersCount: number;
};

const ChannelCard: React.FC<TProps> = ({ uuid, channelName, type, iconUrl, onlineCount, usersCount }): JSX.Element => {
  const dispatch = useDispatch();

  const selectChannel = () => {
    dispatch(setActiveChannelId(uuid));
  };

  return (
    <NavLink to={`/channel/${uuid}`} className={s.wrapper} activeClassName={s.active_channel} onClick={selectChannel}>
      <Avatar url={iconUrl} />
      <Spacer width={10} />
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
