import React from 'react';
import ChannelName from './ChannelName/ChannelName';
import ChannelChatList from './ChannelChatList/ChannelChatList';
import useModal from '../../common/hooks/useModal';
import InviteLinkModal from '../Modals/InviteLinkModal/InviteLinkModal';
import CreateChatModal from '../Modals/CreateChatModal/CreateChatModal';
import { TChat } from '../../store/chats/types';
import ChatSettingsModal from '../Modals/ChatSettingsModal/ChatSettingsModal';
import ChannelSettingsModal from '../Modals/ChannelSettingsModal/ChannelSettingsModal';
import { TActiveConnection } from '../../store/appdata/types';
import s from './channelsidebar.module.css';

type TProps = {
  channelName: string;
  chats: TChat[] | null;
  connection: TActiveConnection;
  channelId: string;
};

const ChannelSidebar: React.FC<TProps> = ({ channelName, chats, connection, channelId }): JSX.Element => {
  const inviteModal = useModal<string>(channelId);
  const chatCreatorModal = useModal();
  const chatSettingsModal = useModal<string>();
  const channelSettingsModal = useModal<string>();

  return (
    <>
      <div className={s.wrapper}>
        <ChannelName
          channelName={channelName}
          channelId={channelId}
          openInvite={inviteModal.open}
          openChannelSettings={channelSettingsModal.open}
        />
        <ChannelChatList
          chats={chats}
          connection={connection}
          openChatCreator={chatCreatorModal.open}
          openChatSettings={chatSettingsModal.open}
        />
      </div>
      {inviteModal.isOpen && inviteModal.payload && (
        <InviteLinkModal isFading={inviteModal.isFading} close={inviteModal.close} cid={inviteModal.payload} />
      )}
      {chatCreatorModal.isOpen && (
        <CreateChatModal isFading={chatCreatorModal.isFading} close={chatCreatorModal.close} cid={channelId} />
      )}
      {chatSettingsModal.isOpen && chats && (
        <ChatSettingsModal
          isFading={chatSettingsModal.isFading}
          close={chatSettingsModal.close}
          chat={chats.find((chat) => chat.uuid === chatSettingsModal.payload)!}
        />
      )}
      {channelSettingsModal.isOpen && channelId && (
        <ChannelSettingsModal
          isFading={channelSettingsModal.isFading}
          close={channelSettingsModal.close}
          channelId={channelSettingsModal.payload!}
        />
      )}
    </>
  );
};

export default ChannelSidebar;
