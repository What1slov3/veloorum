import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchLeaveChannel } from '../../../../store/user/thunk';
import { TStore } from '../../../../types/common';
import { TModalOpenFunc } from '../../../../types/hooks';
import s from './channeldropmenu.module.css';

type TProps = {
  close: () => void;
  openInvite: TModalOpenFunc<string>;
  openChannelSettings: TModalOpenFunc<string>;
  channelId: string;
};

const ChannelDropMenu: React.FC<TProps> = ({ close, openInvite, channelId, openChannelSettings }): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  const uid = useSelector((state: TStore) => state.user.uuid);
  const channel = useSelector((state: TStore) => state.channels[channelId]);

  const createInvite = () => {
    openInvite();
    close();
  };

  const leaveChannel = () => {
    dispatch(fetchLeaveChannel(channel!.uuid));
    history.push('/');
  };

  const handleOpenChannelSettings = () => {
    openChannelSettings(channelId);
  };

  return (
    <>
      <div className={s.wrapper} data-dropmenu="true">
        {channel?.ownerId === uid && (
          <Item onClick={handleOpenChannelSettings}>
            <span className={s.channel_settings}>Настройки канала</span>
            <i className="fal fa-cog"></i>
          </Item>
        )}
        <Item onClick={createInvite}>
          <span className={s.create_invite}>Создать приглашение</span>
          <i className={`fal fa-user-plus ${s.create_invite}`}></i>
        </Item>
        {channel?.ownerId !== uid && (
          <Item onClick={leaveChannel}>
            <span className={s.leave_channel}>Покинуть канал</span>
            <i className={`fal fa-sign-out ${s.leave_channel}`}></i>
          </Item>
        )}
      </div>
    </>
  );
};

type TItemProps = {
  onClick?: () => void;
};

const Item: React.FC<TItemProps> = ({ children, onClick }): JSX.Element => {
  return (
    <div className={s.wrapper_item} onClick={onClick}>
      {children}
    </div>
  );
};

export default ChannelDropMenu;
