import { isDev } from './../common/utils/isDev';
import axios from 'axios';
import ChatAPI from './routes/chat';
import UserAPI from './routes/user';
import ChannelAPI from './routes/channel';
import InviteAPI from './routes/invite';
import MessagesAPI from './routes/messages';
import UsersAPI from './routes/users';
import FilesAPI from './routes/files';
import { PROCESS_ENV } from '../env/env';

export const axiosInstance = axios.create({
  baseURL: isDev() ? PROCESS_ENV.localhost : PROCESS_ENV.apiURL,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

// TODO 401 - кидаем на логин

const API = {
  user: UserAPI,
  channels: ChannelAPI,
  invites: InviteAPI,
  chats: ChatAPI,
  messages: MessagesAPI,
  users: UsersAPI,
  files: FilesAPI,
};

export default API;
