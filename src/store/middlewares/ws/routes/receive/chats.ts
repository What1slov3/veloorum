import { TChat } from './../../../../chats/types';
import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';
import { chatDeleteMessage, chatEditMessage, chatSendMessage, addChat } from '../../../../chats';
import { pullTypingUsers } from '../../../../appdata';
import { pushNewChat } from '../../../../channels';

export const receiveChats = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    userMessage: () => {
      store.dispatch(chatSendMessage(payload));
      store.dispatch(pullTypingUsers({ cid: payload.context.chatId, uid: payload.ownerId }));
    },
    deleteUserMessage: () => {
      store.dispatch(chatDeleteMessage(payload));
    },
    editUserMessage: () => {
      store.dispatch(chatEditMessage(payload));
    },
    pushNewChat: () => {
      socket.emit('joinChat', { cid: (payload as TChat).uuid });
      store.dispatch(addChat(payload));
      store.dispatch(pushNewChat(payload));
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
