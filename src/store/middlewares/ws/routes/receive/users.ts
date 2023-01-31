import { Socket } from 'socket.io-client';
import { Store } from '@customTypes/common.types';
import { updateUserData } from '@store/users/index';

export const receiveUsers = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: Store = store.getState();

  const routes: Record<string, Function> = {
    updateUserData: () => {
      store.dispatch(updateUserData(payload));
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
