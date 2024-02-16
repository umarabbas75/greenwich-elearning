import { useMutation, useQuery, useQueryClient } from 'react-query';

import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchDriverList = (axiosAuth: any, status?: string, page?: any) => {
  return axiosAuth.get(
    `/api/drivers/${
      status ? `?status=${status}${page ? `&page=${page}` : ''}` : `${page ? `?page=${page}` : ''}`
    }`,
  );
};

export const useFetchDriverList = ({
  onSuccess,
  status,
  page,
}: {
  page?: any;
  onSuccess?: any;
  status?: string;
} = {}) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(['driver-list'], () => fetchDriverList(axiosAuth, status, page), {
    keepPreviousData: true,
    ...(onSuccess && { onSuccess: onSuccess }),
  });
};

export const useFetchMapDriver = ({
  onSuccess,
  status,
  page,
}: {
  page?: any;
  onSuccess?: any;
  status?: string;
} = {}) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(['driver-list-map'], () => fetchDriverList(axiosAuth, status, page), {
    keepPreviousData: true,
    ...(onSuccess && { onSuccess: onSuccess }),
  });
};

const uploadDriver = (axiosAuth: any, payload: FormData) => {
  return axiosAuth.post(`/api/driver`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const useUploadDriver = ({ onSuccess, onError }: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return uploadDriver(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('driver-list');
      onSuccess && onSuccess();
    },
    onError: (error) => {
      onError && onError(error); // Call the error callback
    },
  });

  return mutation;
};

const deleteDriver = (axiosAuth: any, id: string) => {
  return axiosAuth.delete(`/api/drivers/${id}/`, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const useDeleteDriver = (onSuccessCallback: any, onErrorCallback: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return deleteDriver(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('driver-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
