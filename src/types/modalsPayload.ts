import { TMessageContent, TMessageContext } from '../store/chats/types';

export type TDeleteMessageModalPayload = {
  username: string;
  content: TMessageContent | { text: React.ReactNodeArray };
  context: TMessageContext;
  createdAt: number;
  uuid: string;
};
