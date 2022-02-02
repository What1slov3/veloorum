import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';

export const emitChannels = (socket: Socket, action: any, store: any) => {
  const actionSplittedType = action.type.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    updateChannelIcon: () => {
      socket.emit('updateChannel', action.payload);
    },
    updateChannel: () => {
      socket.emit('updateChannel', action.payload);
    },
  };

  if (routes[actionSplittedType[1]]) routes[actionSplittedType[1]]();
};
