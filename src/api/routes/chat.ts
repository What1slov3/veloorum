import { TUpdatableFieldsChat } from './../../store/chats/types';
import { TChat } from '../../../../bff_types/common';
import { axiosInstance } from '../index';

class ChatAPI {
  public async findChatsForChannel(cid: string) {
    return axiosInstance
      .get(`/chats/find_for_channel?cid=${cid}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async preloadAllChats(cid: string[]) {
    return axiosInstance
      .post('/chats/preload_all_chats', { cid })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async createChat(cid: string, title: string) {
    return axiosInstance
      .post('/chats/create', { title, owningChannelId: cid, members: [] })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async deleteChat(cid: string) {
    return axiosInstance
      .delete(`/chats/${cid}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async updateChat(data: { cid: string; chat: TUpdatableFieldsChat }) {
    return axiosInstance
      .patch(`/chats/update`, data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}

export default new ChatAPI();
