export type ChannelStore = Record<string, Channel>;

export type Channel = {
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
