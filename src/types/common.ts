import { TUser } from './../store/user/types';
import { TErrorsStore } from './../store/errors/types';
import { TAppData } from './../store/appdata/types';
import { TChats } from '../store/chats/types';
import { TUsersStore } from './../store/users/types';
import { TChannelStore } from '../store/channels/types';

export type TStore = {
  user: TUser;
  channels: TChannelStore;
  appdata: TAppData;
  chats: TChats;
  users: TUsersStore;
  errors: TErrorsStore;
};
