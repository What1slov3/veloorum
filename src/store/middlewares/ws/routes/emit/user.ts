import { Store } from '@customTypes/common.types';
import { User } from '@customTypes/redux/user.types';
import { Socket } from 'socket.io-client';

export const emitUser = (socket: Socket, action: any, store: any) => {
  const actionSplittedType = action.type.split('/');
  const state: Store = store.getState();

  const routes: Record<string, Function> = {
    changeUserData: () => {
      socket.emit('updateUserData', {
        username: (action.payload as User).username,
        uid: state.user.uuid,
        channels: state.user.channels,
      });
    },
    uploadAvatar: () => {
      socket.emit('updateUserData', {
        avatarUrl: (action.payload as User).avatarUrl,
        uid: state.user.uuid,
        channels: state.user.channels,
      });
    },
  };

  if (routes[actionSplittedType[1]]) routes[actionSplittedType[1]]();
};
