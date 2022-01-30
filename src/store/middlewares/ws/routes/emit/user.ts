import { TUser } from './../../../../user/types';
import { TStore } from '../../../../../types/common';
import { Socket } from 'socket.io-client';

export const emitUser = (socket: Socket, action: any, store: any) => {
  const actionSplittedType = action.type.split('/');
  const state: TStore = store.getState();

  const routes: Record<string, Function> = {
    changeUserData: () => {
      socket.emit('updateUserData', {
        username: (action.payload as TUser).username,
        uid: state.user.uuid,
        channels: state.user.channels,
      });
    },
    uploadAvatar: () => {
      socket.emit('updateUserData', {
        avatarUrl: (action.payload as TUser).avatarUrl,
        uid: state.user.uuid,
        channels: state.user.channels,
      });
    },
  };

  if (routes[actionSplittedType[1]]) routes[actionSplittedType[1]]();
};
