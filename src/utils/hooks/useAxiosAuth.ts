import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import axiosAuth from '../axiosAuth';

const useAxiosAuth = () => {
  const { data: session } = useSession();
  // const [sessionExpire, setSessionExpireModal] = useAtom(
  //   sessionExpireModalAtom,
  // );
  // const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${session?.user?.access}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        // const prevReq = error.config;

        // if (error.response.status === 401 && !prevReq.retry) {
        //   if (prevReq.url === '/api/login/refresh/') {
        //     setSessionExpireModal({
        //       ...sessionExpire,
        //       status: true,
        //     });
        //   } else {
        //     prevReq.retry = true;
        //     await refresh();
        //     const updatedSession = await getSession();

        //     prevReq.headers[
        //       'Authorization'
        //     ] = `Bearer ${updatedSession?.user?.access}`;
        //     return axiosAuth(prevReq);
        //   }
        // }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session]);

  return axiosAuth;
};

export default useAxiosAuth;
