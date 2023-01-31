import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLeaveChannel } from '@store/user/thunk';
import { FCChildren, Store } from '@customTypes/common.types';
import s from './channeldropmenu.module.css';

type Props = {
  close: () => void;
  openInvite: () => void;
  openChannelSettings: (channelId: string) => void;
  channelId: string;
};

const ChannelDropMenu: React.FC<Props> = ({ close, openInvite, channelId, openChannelSettings }): JSX.Element => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const uid = useSelector((state: Store) => state.user.uuid);
  const channel = useSelector((state: Store) => state.channels[channelId]);

  const createInvite = () => {
    openInvite();
    close();
  };

  const leaveChannel = () => {
    dispatch(fetchLeaveChannel(channel!.uuid));
    navigate('/');
  };

  const handleOpenChannelSettings = () => {
    openChannelSettings(channelId);
  };

  return (
    <>
      <div className={s.wrapper}>
        {channel?.ownerId === uid && (
          <Item onClick={handleOpenChannelSettings}>
            <span className={s.channel_settings}>Настройки канала</span>
            <i className="fas fa-cog"></i>
          </Item>
        )}
        <Item onClick={createInvite}>
          <span className={s.create_invite}>Создать приглашение</span>
          <i className={`fas fa-user-plus ${s.create_invite}`}></i>
        </Item>
        {channel?.ownerId !== uid && (
          <Item onClick={leaveChannel}>
            <span className={s.leave_channel}>Покинуть канал</span>
            <i className={`fas fa-sign-out ${s.leave_channel}`}></i>
          </Item>
        )}
      </div>
    </>
  );
};

type ItemProps = {
  onClick?: () => void;
};

const Item: React.FC<ItemProps & FCChildren> = ({ children, onClick }): JSX.Element => {
  return (
    <div className={s.wrapper_item} onClick={onClick}>
      {children}
    </div>
  );
};

export default ChannelDropMenu;
