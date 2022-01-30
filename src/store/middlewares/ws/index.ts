import { emitChannels } from './routes/emit/channels';
import { receiveChannels } from './routes/receive/channels';
import { receiveUsers } from './routes/receive/users';
import { emitUser } from './routes/emit/user';
import { emitAppdata } from './routes/emit/appdata';
import { receiveAppdata } from './routes/receive/appdata';
import { receiveCommon } from './routes/receive/common';
import { receiveChats } from './routes/receive/chats';
import { emitChats } from './routes/emit/chats';
import { Dispatch } from 'redux';
import { io } from 'socket.io-client';
import { TStore } from './../../../types/common';
import store from '../..';
import { setWsConnected, setWsConnectionError } from '../../appdata';

const socket = io('ws://localhost:3001', { transports: ['websocket'] });

const registerUser = () => {
  const state = store.getState() as TStore;

  if (state.appdata.init.fulfilled) {
    socket.emit('registerUser', {
      chats: Object.keys(state.chats),
      channels: Object.keys(state.channels),
    });
  } else {
    setTimeout(() => registerUser(), 500);
  }
};

const setConnectionStatus = () => {
  store.dispatch(setWsConnected(socket.connected));
};

socket.on('connect', () => {
  registerUser();
  if ((store.getState() as TStore).appdata.wsData.wsConnectionError) {
    store.dispatch(setWsConnectionError(false));
  }
});

socket.on('disconnect', () => {
  setConnectionStatus();
  store.dispatch(setWsConnectionError(true));
});

socket.on('userRegistered', (data) => {
  if (data.success) setConnectionStatus();
});

socket.onAny((eventName: string, payload: any) => {
  payload = { ...payload, received: true };

  const routes: Record<string, Function> = {
    chats: receiveChats,
    common: receiveCommon,
    appdata: receiveAppdata,
    users: receiveUsers,
    channels: receiveChannels,
  };

  const splittedEventName = eventName.split('/');
  if (splittedEventName[0] === 'receive') {
    routes[splittedEventName[1]](socket, eventName, payload, store);
  }
});

export const wsMiddleware = (store: any) => (next: any) => (action: any) => {
  if (!action) return;

  if (action.payload?.received) return next(action);

  const routes: Record<string, Function> = {
    chats: emitChats,
    appdata: emitAppdata,
    user: emitUser,
    channels: emitChannels,
  };

  const splittedActionType = action.type.split('/');
  if (
    socket.connected &&
    routes[splittedActionType[0]] &&
    (splittedActionType[2] === 'fulfilled' || splittedActionType[2] === undefined)
  ) {
    routes[splittedActionType[0]](socket, action, store);
  }

  next(action);
};
