import { Store } from '@customTypes/common.types';
import { Chat } from '@customTypes/redux/chats.types';
import { Socket } from 'socket.io-client';

export const emitChats = (socket: Socket, action: any, store: any) => {
  const actionSplittedType = action.type.split('/');
  const state: Store = store.getState();

  const routes: Record<string, Function> = {
    sendMessage: () => {
      socket.emit('sendUserMessage', action.payload);
    },
    deleteMessage: () => {
      socket.emit('deleteUserMessage', action.payload);
    },
    editMessage: () => {
      socket.emit('editUserMessage', action.payload);
    },
    createChat: () => {
      socket.emit('createChat', action.payload);
      socket.emit('joinChat', { cid: (action.payload as Chat).uuid });
    },
  };

  if (routes[actionSplittedType[1]]) routes[actionSplittedType[1]]();
};
