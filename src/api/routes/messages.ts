import { MessageContent, MessageContext } from '../../types/redux/chats.types';
import { axiosInstance } from '../index';

class MessagesAPI {
  public async sendMessage({ content, context }: { content: MessageContent; context: MessageContext }) {
    const data = {
      content,
      context,
    };
    return axiosInstance
      .post('/messages/send', data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async getHistory({ shift, chatId }: { shift: number; chatId: string }) {
    return axiosInstance
      .get(`/messages/get_history?cid=${chatId}&shift=${shift}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async deleteMessage({ cid, mid }: { cid: string; mid: string }) {
    return axiosInstance
      .delete(`/messages/delete?cid=${cid}&mid=${mid}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async editMessage({ cid, mid, content }: { cid: string; mid: string; content: MessageContent }) {
    return axiosInstance
      .put(`/messages/edit`, { cid, mid, content })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}

export default new MessagesAPI();
