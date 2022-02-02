import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';
import { addChannelMember, pullChannelMember } from '../../../../channels';

export const receiveCommon = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    userJoin: () => {
      store.dispatch(addChannelMember({ uid: payload.content.targetUser!, cid: payload.context.channelId }));
    },
    userLeft: () => {
      store.dispatch(pullChannelMember({ uid: payload.content.targetUser!, cid: payload.context.channelId }));
    },
  };

  if (routes[actionSplittedType[2]]) routes[actionSplittedType[2]]();
};
