import React, { useMemo } from 'react';
import { ActiveConnection } from '@customTypes/redux/appdata.types';
import { Chat } from '@customTypes/redux/chats.types';
import Accordion from '@components/Accordion/Accordion';
import Tooltip from '@components/Tooltip/Tooltip';
import ChatLink from '../ChatLink/ChatLink';
import s from './channelchatlist.module.css';

type Props = {
  chats: Chat[] | null;
  connection: ActiveConnection;
  openChatCreator: () => void;
  openChatSettings: (chatId: string) => void;
  isAdmin: boolean;
};

const ChannelChatList: React.FC<Props> = ({
  chats,
  connection,
  openChatCreator,
  openChatSettings,
  isAdmin,
}): JSX.Element => {
  const renderChats = useMemo(() => {
    if (chats) {
      return chats.map((chat) => {
        const { uuid, title } = chat;
        return (
          <ChatLink
            key={uuid}
            title={title}
            uuid={uuid}
            active={connection.chatId === uuid}
            openChatSettings={openChatSettings}
            isAdmin={isAdmin}
            activeChannelId={connection.channelId!}
          />
        );
      });
    }
  }, [chats, connection]);

  const activeChatBlock = useMemo(() => {
    if (chats && connection.chatId) {
      const { uuid, title } = chats.find((chat) => chat.uuid === connection.chatId) || { uuid: '', title: '' };
      return (
        <ChatLink
          key={uuid}
          title={title}
          uuid={uuid}
          openChatSettings={openChatSettings}
          active={true}
          isAdmin={isAdmin}
          activeChannelId={connection.channelId!}
        />
      );
    }
  }, [chats, connection]);

  return (
    <div className={s.wrapper}>
      <div className={s.scroll_spacer}>
        <Accordion
          title="Текстовые чаты"
          extraButton={
            isAdmin ? (
              <Tooltip position="right" text="Добавить чат">
                <i className={`fas fa-plus ${s.create_chat_btn}`} onClick={openChatCreator}></i>
              </Tooltip>
            ) : undefined
          }
          activeBlock={activeChatBlock}
        >
          {chats && renderChats}
        </Accordion>
      </div>
    </div>
  );
};

export default ChannelChatList;
