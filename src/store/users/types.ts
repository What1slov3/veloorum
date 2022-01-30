import { TDefaultAction } from './../../types/reducers';

export type TLoadedUser = {
  uuid: string;
  avatarUrl: string;
  username: string;
  tag: string;
};

export type TUsersStore = Record<string, TLoadedUser>;

export type TGetLoadedUserAction = TDefaultAction<Record<string, TLoadedUser>>;
