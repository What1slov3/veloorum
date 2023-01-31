import { CSSProperties, ReactNode } from 'react';
import { AppData } from '@customTypes/redux/appdata.types';
import { UsersStore } from '@customTypes/redux/users.types';
import { User } from '@customTypes/redux/user.types';
import { ErrorsStore } from '@customTypes/redux/errors.types';
import { Chats } from '@customTypes/redux/chats.types';
import { ChannelStore } from '@customTypes/redux/channels.types';

export type Store = {
  user: User;
  channels: ChannelStore;
  appdata: AppData;
  chats: Chats;
  users: UsersStore;
  errors: ErrorsStore;
};

export type FCChildren = {
  children?: ReactNode;
};

export type FCStyle = {
  style?: CSSProperties;
};
