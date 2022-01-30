import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';
import { updateChannel } from '../../../../channels/index';

export const receiveChannels = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    updateChannel: () => {
      store.dispatch(updateChannel(payload));
    },
  };
  
  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
