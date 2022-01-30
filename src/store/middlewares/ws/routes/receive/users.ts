import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';
import { updateUserData } from '../../../../users/index';

export const receiveUsers = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    updateUserData: () => {
      store.dispatch(updateUserData(payload));
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
