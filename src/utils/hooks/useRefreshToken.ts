import { useSession } from 'next-auth/react';

import axiosAuth from '../axiosAuth';

const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    const res = await axiosAuth.post('/api/login/refresh/', {
      refresh: session?.user?.refresh,
    });
    if (session) {
      // session.user.access = res.data.access;
      // session.user.refresh = res.data.refresh;
      await update({
        access: res.data.access,
        refresh: res.data.refresh,
      });
    }
  };

  return refreshToken;
};

export default useRefreshToken;
