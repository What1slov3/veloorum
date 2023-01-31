export type AxiosGetHistory = {
  shift: number;
  channelId: string;
  textChannelId: string;
};

export type AxiosUpdateChannelIcon = {
  cid: string;
  icon: File;
};

export type AxiosUpdateChannel = {
  cid: string;
  title?: string;
  description?: string;
  systemChat?: string;
};

export type AxiosChangeUserData = {
  username: string;
  email: string;
  password: string;
};

export type AxiosChangePassword = {
  currentPassword: string;
  newPassword: string;
};