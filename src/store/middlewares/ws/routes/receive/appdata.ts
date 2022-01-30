import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';
import { addTypingUsers, pullTypingUsers } from '../../../../appdata';

let typingTimeout: any;

export const receiveAppdata = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    addTypingUser: () => {
      store.dispatch(addTypingUsers(payload));
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => store.dispatch(pullTypingUsers(payload)), 1500);
    }
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
