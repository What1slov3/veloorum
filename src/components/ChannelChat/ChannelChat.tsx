import React, { MutableRefObject, useCallback, useRef } from 'react';
import ChannelNavbar from './ChannelNavbar/ChannelNavbar';
import ChannelInput from './ChannelInput/ChannelInput';
import ChatScroller from './ChatScroller/ChatScroller';
import { AttachmentPayload, DeleteMessageModalPayload, SymbolLimitPayload } from '@customTypes/modals.types';
import TypingIndicator from './TypingIndicator/TypingIndicator';
import { useDispatch } from 'react-redux';
import { setModal } from '@store/appdata';
import { UsersStore } from '@customTypes/redux/users.types';
import { User } from '@customTypes/redux/user.types';
import { Chat, MessageContext } from '@customTypes/redux/chats.types';
import { MODAL_NAMES } from '@common/constants';
import s from './channelchat.module.css';

export type LimitModal = { length: number; limit: number };

type Props = {
  context: MessageContext;
  chat: Chat;
  user: User;
  loadedUsers: UsersStore;
  systemChatId: string;
};

const ChannelChat: React.FC<Props> = ({ chat, user, context, loadedUsers, systemChatId }): JSX.Element => {
  const dispatch = useDispatch<any>();

  const scrollToBottomRef = useRef<HTMLDivElement>(null!);

  const scrollToBottom = useCallback(() => {
    if (scrollToBottomRef.current) scrollToBottomRef.current.scrollIntoView();
  }, []);

  const openDeleteMessageModal = useCallback((payload: DeleteMessageModalPayload) => {
    dispatch(setModal({ name: MODAL_NAMES.DELETE_MESSAGE, payload }));
  }, []);

  const openSymbolLimitModal = useCallback(({ length }: SymbolLimitPayload) => {
    dispatch(setModal({ name: MODAL_NAMES.SYMBOL_LIMIT, payload: { length } }));
  }, []);

  const openAttachmentModal = useCallback((url: string) => {
    dispatch(setModal({ name: MODAL_NAMES.ATTACHMENT, payload: { url } as AttachmentPayload }));
  }, []);

  const setAnchorRef = (ref: MutableRefObject<HTMLDivElement>) => {
    scrollToBottomRef.current = ref.current;
  };

  return (
    <>
      <div className={s.wrapper}>
        <ChannelNavbar textChannelName={chat.title} />
        <ChatScroller
          context={context}
          history={chat.history}
          user={user}
          loadedUsers={loadedUsers}
          openDeleteModal={openDeleteMessageModal}
          setAnchorRef={setAnchorRef}
          openSymbolLimitModal={openSymbolLimitModal}
          openAttachmentModal={openAttachmentModal}
        />
        <ChannelInput
          placeholder={`Написать в #${chat.title}`}
          uid={user.uuid}
          context={context}
          scrollToBottom={scrollToBottom}
          chatTitle={chat.title}
          disable={context.chatId === systemChatId}
        />
        <TypingIndicator uid={user.uuid} context={context} loadedUsers={loadedUsers} />
      </div>
    </>
  );
};

export default ChannelChat;
