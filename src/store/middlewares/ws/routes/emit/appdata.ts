import { Store } from '@customTypes/common.types';
import { Socket } from 'socket.io-client';

export const emitAppdata = (socket: Socket, action: any, store: any) => {
  const actionSplittedType = action.type.split('/');
  const state: Store = store.getState();

  const routes: Record<string, Function> = {
    addTypingUsers: () => {
      socket.emit('addTypingUser', action.payload);
    },
  };

  if (routes[actionSplittedType[1]]) routes[actionSplittedType[1]]();
};
