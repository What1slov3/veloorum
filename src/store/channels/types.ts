export type TChannelStore = Record<string, TChannel>;

export type TChannel = {
  uuid: string;
  type: 'dm' | 'public';
  chats: string[];
  iconUrl: string;
  title: string;
  members: string[];
  ownerId: string;
  description: string;
  systemChat: string;
};  
