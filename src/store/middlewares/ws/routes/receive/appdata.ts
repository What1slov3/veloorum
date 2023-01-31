import { addTypingUsers, pullTypingUsers } from '@store/appdata';
import { Store } from '@customTypes/common.types';
import { Socket } from 'socket.io-client';

let typingTimeout: any;

export const receiveAppdata = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: Store = store.getState();

  const routes: Record<string, Function> = {
    addTypingUser: () => {
      store.dispatch(addTypingUsers(payload));
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => store.dispatch(pullTypingUsers(payload)), 1500);
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
