import { axiosInstance } from '../index';

class UsersAPI {
  public async getLoadedUsers(users: string[]) {
    return axiosInstance
      .post('/users/get_loaded_users', { usersId: users })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}

export default new UsersAPI();
