import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';
import { addChannelMember } from '../../../../channels';

export const receiveCommon = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    newUser: () => {
      store.dispatch(addChannelMember(payload));
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
