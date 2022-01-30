import { TAxiosChangeUserData, TAxiosChangePassword } from './../types';
import { axiosInstance } from '../index';

class UserAPI {
  public async init() {
    return axiosInstance
      .get('/users/init')
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async uploadAvatar(avatar: File) {
    const data = new FormData();
    data.append('avatar', avatar);

    return axiosInstance
      .post('/users/upload_avatar', data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async leaveChannel(cid: string) {
    return axiosInstance
      .post('/users/leave_channel', { cid })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async changeUserData(userData: TAxiosChangeUserData) {
    return axiosInstance
      .post('/users/change_user_data', userData)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async changePassword(passwords: TAxiosChangePassword) {
    return axiosInstance
      .post('/users/change_password', passwords)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}

export default new UserAPI();
