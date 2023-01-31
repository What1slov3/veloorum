import { wsMiddleware } from './middlewares/ws/index';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import userSlice from './user/index';
import usersSlice from './users/index';
import channelsSlice from './channels/index';
import appdataSlice from './appdata/index';
import chatsSlice from './chats/index';
import errorsSlice from './errors/index';

const reducer = combineReducers({
  user: userSlice,
  channels: channelsSlice,
  appdata: appdataSlice,
  chats: chatsSlice,
  users: usersSlice,
  errors: errorsSlice,
});

const store = configureStore({
  reducer,
  middleware: [thunk, wsMiddleware],
});

export default store;
