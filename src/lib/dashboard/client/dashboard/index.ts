import { useQuery } from 'react-query';

import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchDashboardData = (axiosAuth: any) => {
  return axiosAuth.get(`/api/dashboard/`);
};

export const useFetchDashboard = () => {
  const axiosAuth = useAxiosAuth();
  //const query = generateQueryString({ search, page });

  return useQuery(['dashboard'], () => fetchDashboardData(axiosAuth), {
    keepPreviousData: true,
  });
};
