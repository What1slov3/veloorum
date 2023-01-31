export type ChannelMessageAttachment = {
  uuid: string;
  filename: string;
  description: string;
  size: number;
  url: string;
  contentType: string;
};

export type Message = {
  content: MessageContent;
  context: MessageContext;
  ownerId: string;
  uuid: string;
  createdAt: number;
  updatedAt: number;
  systemType?: MessageSystemType;
  type?: MessageType;
  realtime?: boolean;
};

export type MessageContent = {
  text: string;
  targetUser?: string;
  attachments?: string[];
};

export type MessageContext = {
  chatId: string;
  channelId: string;
};

export type MessageType = 'user' | 'system';
export type MessageSystemType = 'userJoin' | 'userLeft';

export type Chat = {
  uuid: string;
  title: string;
  members: string[];
  history: Message[];
  owningChannelId: string;
};

export type Chats = Record<string, Chat>;

// ACTIONS TYPES

export type UpdatableFieldsChat = {
  title?: string;
};
