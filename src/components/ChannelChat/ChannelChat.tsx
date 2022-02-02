import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import ChannelNavbar from './ChannelNavbar/ChannelNavbar';
import ChannelInput from './ChannelInput/ChannelInput';
import ChatScroller from './ChatScroller/ChatScroller';
import DeleteMessageModal from '../Modals/DeleteMessageModal/DeleteMessageModal';
import useModal from '../../common/hooks/useModal';
import { TDeleteMessageModalPayload } from '../../types/modalsPayload';
import { TUsersStore } from '../../store/users/types';
import { TChat, TMessageContext } from '../../store/chats/types';
import { TUser } from '../../store/user/types';
import TypingIndicator from './TypingIndicator/TypingIndicator';
import AttachmentModal from '../Modals/AttachmentModal/AttachmentModal';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from '../../types/common';
import { setOpenedAttachment } from '../../store/appdata';
import SymbolLimitModal from '../Modals/SymbolLimitModal/SymbolLimitModal';
import s from './channelchat.module.css';

type TProps = {
  context: TMessageContext;
  chat: TChat;
  user: TUser;
  loadedUsers: TUsersStore;
  systemChatId: string;
};

const ChannelChat: React.FC<TProps> = ({ chat, user, context, loadedUsers, systemChatId }): JSX.Element => {
  const dispatch = useDispatch();

  const openedAttachment = useSelector((state: TStore) => state.appdata.openedAttachment);

  const deleteModal = useModal<TDeleteMessageModalPayload>();
  const attachmentModal = useModal<string>('');
  // ? [length, limit]
  const symbolLimitModal = useModal<[number, number]>([0, 0]);

  const scrollToBottomRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!attachmentModal.isFading) dispatch(setOpenedAttachment(''));
  }, [attachmentModal.isFading]);

  const scrollToBottom = useCallback(() => {
    if (scrollToBottomRef.current) scrollToBottomRef.current.scrollIntoView();
  }, [scrollToBottomRef]);

  const openDeleteModal = useCallback((payload: TDeleteMessageModalPayload) => {
    deleteModal.open(payload);
  }, []);

  const openSymbolLimitModal = useCallback((payload: [number, number]) => {
    symbolLimitModal.open(payload);
  }, []);

  return (
    <>
      <div className={s.wrapper}>
        <ChannelNavbar textChannelName={chat.title} />
        <ChatScroller
          context={context}
          history={chat.history}
          user={user}
          loadedUsers={loadedUsers}
          // @ts-ignore
          openDeleteModal={openDeleteModal}
          setAnchorRef={(ref: MutableRefObject<HTMLDivElement>) => {
            scrollToBottomRef.current = ref.current;
          }}
          openSymbolLimitModal={openSymbolLimitModal}
        />
        <ChannelInput
          placeholder={`Написать в #${chat.title}`}
          uid={user.uuid}
          context={context}
          scrollToBottom={scrollToBottom}
          chatTitle={chat.title}
          openSymbolLimitModal={openSymbolLimitModal}
          disable={context.chatId === systemChatId}
        />
        <TypingIndicator uid={user.uuid} context={context} loadedUsers={loadedUsers} />
      </div>
      {deleteModal.isOpen && deleteModal.payload && (
        <DeleteMessageModal isFading={deleteModal.isFading} close={deleteModal.close} message={deleteModal.payload} />
      )}
      {openedAttachment && (
        <AttachmentModal url={openedAttachment} isFading={attachmentModal.isFading} close={attachmentModal.close} />
      )}
      {symbolLimitModal.isOpen && symbolLimitModal.payload && (
        <SymbolLimitModal
          close={symbolLimitModal.close}
          isFading={symbolLimitModal.isFading}
          length={symbolLimitModal.payload[0]}
          limit={symbolLimitModal.payload[1]}
        />
      )}
    </>
  );
};

export default ChannelChat;
