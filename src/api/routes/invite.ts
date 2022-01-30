import { axiosInstance } from '../index';

class InviteAPI {
  public async CreateInvite(cid: string) {
    return axiosInstance
      .post('/invites/create', { cid })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async GetInvite(cid: string) {
    return axiosInstance
      .get(`/invites/get/${cid}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }

  public async GetChannel(url: string) {
    return axiosInstance
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}

export default new InviteAPI();
