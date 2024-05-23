import { tokenProtected } from 'api/axios';

export const post = async (data) => {
  return await tokenProtected().post('/api/upload/', data, {
    onUploadProgress: (progress) => console.log(progress),
    validateStatus: (status) => status === 200,
  });
};
