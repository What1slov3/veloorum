import { Message, MessageContent, MessageContext } from '@customTypes/redux/chats.types';

export type LSStructure = {
  unsentMessages: LSUnsentMessages;
  sendingErrorMessages: {
    [channelId: string]: Message[];
  };
  settings: LSSettings;
};

export type LSUnsentMessages = Record<string, MessageContent>;

export type LSUnsentMessage = {
  context: MessageContext;
  content: MessageContent;
};

export type LSUploadedAttachments = Record<string, File[]>;

export type LSSettings = {
  fontSize: number;
  messageGroupGap: number;
};
