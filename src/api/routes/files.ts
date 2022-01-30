import { axiosInstance } from '../index';

class FilesAPI {
  public async UploadFiles(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });

    return axiosInstance
      .post('/files/upload', formData)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
}

export default new FilesAPI();
