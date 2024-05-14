import { URL } from 'configuration';
import axios from 'axios';

const token = window.localStorage.getItem('token');

const protectedApi = axios.create({
  baseURL: URL.API_BASE_URL.WHITE_BLOB,
  headers: {
    Authorization: 'bearer ' + token,
  },
});

export default protectedApi;
