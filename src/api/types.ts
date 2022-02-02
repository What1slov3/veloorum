export type TAxiosGetHistory = {
  shift: number;
  channelId: string;
  textChannelId: string;
};

// TODO сделать что-то с типами

export type TAxiosUpdateChannelIcon = {
  cid: string;
  icon: File;
};

export type TAxiosUpdateChannel = {
  cid: string;
  title?: string;
  description?: string;
  systemChat?: string;
};

export type TAxiosChangeUserData = {
  username: string;
  email: string;
  password: string;
};

export type TAxiosChangePassword = {
  currentPassword: string;
  newPassword: string;
};
