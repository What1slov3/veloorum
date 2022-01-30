import { TDefaultAction } from './../../types/reducers';

export type TChannelMessageAttachment = {
  uuid: string;
  filename: string;
  description: string;
  size: number;
  url: string;
  contentType: string;
};

export type TMessage = {
  content: TMessageContent;
  context: TMessageContext;
  ownerId: string;
  uuid: string;
  createdAt: number;
  updatedAt: number;
  systemType?: TMessageSystemType;
  type?: TMessageType;
  realtime?: boolean;
};

export type TMessageContent = {
  text: string;
  targetUser?: string;
  attachments?: string[];
};

export type TMessageContext = {
  chatId: string;
  channelId: string;
};

export type TMessageType = 'user' | 'system';
export type TMessageSystemType = 'new_user';

export type TChat = {
  uuid: string;
  title: string;
  members: string[];
  history: TMessage[];
  owningChannelId: string;
};

export type TChats = Record<string, TChat>;

// ACTIONS TYPES

export type TUpdatableFieldsChat = {
  title?: string;
};
