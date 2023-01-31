import { Socket } from 'socket.io-client';
import { Store } from '@customTypes/common.types';
import { chatDeleteMessage, chatEditMessage, chatSendMessage, addChat } from '@store/chats';
import { pullTypingUsers } from '@store/appdata';
import { pushNewChat } from '@store/channels';
import { Chat } from '@customTypes/redux/chats.types';

export const receiveChats = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: Store = store.getState();

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
      socket.emit('joinChat', { cid: (payload as Chat).uuid });
      store.dispatch(addChat(payload));
      store.dispatch(pushNewChat(payload));
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
