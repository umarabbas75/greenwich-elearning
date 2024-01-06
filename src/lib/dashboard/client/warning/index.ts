import { useQuery } from 'react-query';

import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchWarningList = (axiosAuth: any) => {
  return axiosAuth.get(`/api/warnings/`);
};

export const useFetchWarningList = (onSuccess?: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(['warnings-list'], () => fetchWarningList(axiosAuth), {
    keepPreviousData: true,
    ...(onSuccess && { onSuccess: onSuccess }),
  });
};
