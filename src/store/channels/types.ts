import { TDefaultAction } from '../../types/reducers';
import { TMessageContext } from '../chats/types';

export type TChannelStore = Record<string, TChannel>;

export type TChannel = {
  uuid: string;
  type: 'dm' | 'public';
  chats: string[];
  iconUrl: string;
  title: string;
  members: string[];
  ownerId: string;
};
