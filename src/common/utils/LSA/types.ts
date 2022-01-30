import { TMessageContent, TMessageContext } from './../../../store/chats/types';
import { TMessage } from '../../../store/chats/types';

export type TLSStructure = {
  unsentMessages: TUnsentMessages;
  sendingErrorMessages: {
    [channelId: string]: TMessage[];
  };
  appSettings: TAppSettings;
};

export type TUnsentMessages = Record<string, TMessageContent>;

export type TUnsentMessage = {
  context: TMessageContext;
  content: TMessageContent;
};

export type TUploadedAttachments = Record<string, File[]>;

export type TAppSettings = {
  fontSize: number;
  messageGroupGap: number;
};
