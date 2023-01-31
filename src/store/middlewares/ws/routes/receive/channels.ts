import { Store } from '@customTypes/common.types';
import { updateChannel } from '@store/channels/index';
import { Socket } from 'socket.io-client';

export const receiveChannels = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: Store = store.getState();

  const routes: Record<string, Function> = {
    updateChannel: () => {
      store.dispatch(updateChannel(payload));
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
