import { ReactNode } from 'react';
import { Chat, MessageContent, MessageContext } from '@customTypes/redux/chats.types';

export type DeleteMessageModalPayload = {
  username: string;
  content: MessageContent | { text: ReactNode[] };
  context: MessageContext;
  createdAt: number;
  uuid: string;
};

export type SymbolLimitPayload = {
  length: number;
};

export type AttachmentPayload = { url: string };

export type ChangeUserDataPayload = {
  username: string;
  email: string;
  type: 'username' | 'email';
};

export type ChannelSettingsPayload = {
  channelId: string;
};

export type ChatSettingsPayload = {
  chat: Chat;
};

export type CreateChatPayload = {
  cid: string;
};

export type InviteLinkPayload = {
  cid: string;
};

export type ModalName =
  | null
  | 'attachment'
  | 'changePassword'
  | 'changeUserData'
  | 'channelSettings'
  | 'createChannel'
  | 'createChat'
  | 'deleteMessage'
  | 'inviteLink'
  | 'symbolLimit'
  | 'chatSettings';

export type ModalNameKeys =
  | 'ATTACHMENT'
  | 'CHANGE_PASSWORD'
  | 'CHANGE_USER_DATA'
  | 'CHANNEL_SETTINGS'
  | 'CREATE_CHANNEL'
  | 'CREATE_CHAT'
  | 'DELETE_MESSAGE'
  | 'INVITE_LINK'
  | 'SYMBOL_LIMIT'
  | 'CHAT_SETTINGS';
