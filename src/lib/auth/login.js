import responseApi, { apiUrl } from '@/utils/responseApi';

export const maskLogin = ({ payload }) => {
  return responseApi(`${window.location.origin}/api/login`, 'post', payload);
};
export const backendLogin = ({ payload }) => {
  return responseApi(`${apiUrl}/api/auth/login/?source=normal`, 'post', payload);
};
export const maskLogout = () => {
  return responseApi(`${window.location.origin}/api/logout`, 'get');
};
