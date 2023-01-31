import { User } from '@customTypes/redux/user.types';

export type LoadedUser = Pick<User, 'uuid' | 'avatarColor' | 'avatarUrl' | 'username' | 'tag'>;

export type UsersStore = Record<string, LoadedUser>;
