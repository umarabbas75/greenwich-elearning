/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */

import axios from 'axios';
const CancelToken = axios.CancelToken;
export let cancelRequest;

export const apiUrl = 'https://iclerk-backend-dev.herokuapp.com';

// Axios
axios.defaults.baseURL = apiUrl;

const responseApi = async (url, method, data, headerData = {}) => {
  try {
    const res = await axios({
      method,
      url,
      data,
      headers: { ...headerData },
      cancelToken: new CancelToken(function executor(c) {
        cancelRequest = c;
      }),
    });
    return {
      status: res.status,
      data: res.data?.data ?? res?.data,
      message: res.data?.message ?? 'success',
    };
  } catch (err) {
    let data;
    if (err.response?.status === 500) {
      data = {
        status: err.response?.status,
        message: 'Something went wrong.',
      };
    } else if (err.response?.status === 408) {
      data = {
        status: err.response?.status,
        message: 'Network Erro.',
      };
    }
    data = {
      status: err.response?.status,
      message: err.response?.data,
    };

    return { error: true, ...data };
  }
};

export default responseApi;
