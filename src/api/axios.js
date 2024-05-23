import axios from 'axios';

const token = window.localStorage.getItem('token');

export const tokenProtected = () =>
  axios.create({
    baseURL: URL.API_BASE_URL.WHITE_BLOB,
    headers: {
      Authorization: 'bearer ' + token,
    },
    validateStatus: (status) => status === 200,
    onDownloadProgress: (progressEvent) => progressEvent,
  });
