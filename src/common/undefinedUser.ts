import { User } from '../types/redux/user.types';

export const undefinedUser: Pick<User, 'avatarColor' | 'avatarUrl' | 'uuid' | 'username' | 'tag'> = {
  uuid: 'UNDEFINED',
  avatarUrl: '',
  username: 'Undefined',
  tag: '0000',
  avatarColor: 'hsl(200, 50%, 50%)',
};
