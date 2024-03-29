import { AxiosUpdateChannel, AxiosUpdateChannelIcon } from '../../types/api.types';
import { axiosInstance } from '../index';

class ChannelAPI {
  public async createChannel({ title, icon }: { title: string; icon: File }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('icon', icon);
    formData.append('type', 'channel');

    return axiosInstance
      .post('/channels/create', formData)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async updateChannelIcon({ cid, icon }: AxiosUpdateChannelIcon) {
    const data = new FormData();
    data.append('icon', icon);
    data.append('cid', cid);

    return axiosInstance
      .put('/channels/update_channel_icon', data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async updateChannel(data: AxiosUpdateChannel) {
    return axiosInstance
      .put('/channels/update_channel', data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}

export default new ChannelAPI();
