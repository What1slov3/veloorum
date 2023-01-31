import { Socket } from 'socket.io-client';
import { Store } from '@customTypes/common.types';
import { addChannelMember, pullChannelMember } from '@store/channels';

export const receiveCommon = (socket: Socket, eventName: string, payload: any, store: any) => {
  const actionSplittedType = eventName.split('/');
  const state: Store = store.getState();

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
