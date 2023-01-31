import React from 'react';
import ChannelName from './ChannelName/ChannelName';
import ChannelChatList from './ChannelChatList/ChannelChatList';
import { Chat } from '@customTypes/redux/chats.types';
import { ActiveConnection } from '@customTypes/redux/appdata.types';
import { useDispatch } from 'react-redux';
import { setModal } from '@store/appdata';
import { MODAL_NAMES } from '@common/constants';
import {
  ChannelSettingsPayload,
  ChatSettingsPayload,
  CreateChatPayload,
  InviteLinkPayload,
} from '@customTypes/modals.types';
import s from './channelsidebar.module.css';

type Props = {
  channelName: string;
  chats: Chat[] | null;
  connection: ActiveConnection;
  channelId: string;
  isAdmin: boolean;
};

const ChannelSidebar: React.FC<Props> = ({ channelName, chats, connection, channelId, isAdmin }): JSX.Element => {
  const dispatch = useDispatch<any>();

  const openInviteModal = () => {
    dispatch(setModal({ name: MODAL_NAMES.INVITE_LINK, payload: { cid: channelId } as InviteLinkPayload }));
  };

  const openCreateChatModal = () => {
    dispatch(setModal({ name: MODAL_NAMES.CREATE_CHAT, payload: { cid: channelId } as CreateChatPayload }));
  };

  const openChatSettingsModal = (chatId: string) => {
    dispatch(
      setModal({
        name: MODAL_NAMES.CHAT_SETTINGS,
        payload: { chat: chats!.find((chat) => chat.uuid === chatId) } as ChatSettingsPayload,
      })
    );
  };

  const openChannelSettingsModal = (channelId: string) => {
    dispatch(
      setModal({
        name: MODAL_NAMES.CHANNEL_SETTINGS,
        payload: { channelId } as ChannelSettingsPayload,
      })
    );
  };

  return (
    <>
      <div className={s.wrapper}>
        <ChannelName
          channelName={channelName}
          channelId={channelId}
          openInvite={openInviteModal}
          openChannelSettings={openChannelSettingsModal}
        />
        <ChannelChatList
          chats={chats}
          connection={connection}
          openChatCreator={openCreateChatModal}
          openChatSettings={openChatSettingsModal}
          isAdmin={isAdmin}
        />
      </div>
    </>
  );
};

export default ChannelSidebar;
