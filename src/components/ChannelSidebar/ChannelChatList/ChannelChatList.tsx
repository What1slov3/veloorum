import React, { useMemo } from 'react';
import { TActiveConnection } from '../../../store/appdata/types';
import { TChat } from '../../../store/chats/types';
import { TModalOpenFunc } from '../../../types/hooks';
import Accordion from '../../Accordion/Accordion';
import Tooltip from '../../TooltipWrapper/Tooltip/Tooltip';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import ChatLink from '../ChatLink/ChatLink';
import s from './channelchatlist.module.css';

type TProps = {
  chats: TChat[] | null;
  connection: TActiveConnection;
  openChatCreator: TModalOpenFunc<unknown>;
  openChatSettings: TModalOpenFunc<string>;
};

const ChannelChatList: React.FC<TProps> = ({ chats, connection, openChatCreator, openChatSettings }): JSX.Element => {
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
          />
        );
      });
    }
  }, [chats, connection]);

  const activeChatBlock = useMemo(() => {
    if (chats && connection.chatId) {
      const { uuid, title } = chats.find((chat) => chat.uuid === connection.chatId)!;
      return <ChatLink key={uuid} title={title} uuid={uuid} openChatSettings={openChatSettings} active={true} />;
    }
  }, [chats, connection]);

  return (
    <div className={s.wrapper}>
      <div className={s.scroll_spacer}>
        <Accordion
          title="Текстовые чаты"
          extraButton={
            <TooltipWrapper position="right" tooltipContent={<Tooltip>Добавить чат</Tooltip>}>
              <i className={`fal fa-plus ${s.create_chat_btn}`} onClick={openChatCreator}></i>
            </TooltipWrapper>
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
