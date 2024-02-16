import { useMutation, useQuery, useQueryClient } from 'react-query';

import generateQueryString from '@/utils/generateQueryString';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchGensetList = (axiosAuth: any, query: string) => {
  return axiosAuth.get(`/api/gensets/${query ?? ''}`);
};

const addGenset = (axiosAuth: any, payload: GensetFormValues) => {
  return axiosAuth.post(`/api/gensets/`, payload);
};
const editGenset = (axiosAuth: any, payload: GensetFormValues & { uid: string }) => {
  return axiosAuth.patch(`/api/gensets/${payload.uid}/`, payload);
};

const deleteGenset = (axiosAuth: any, id: string) => {
  return axiosAuth.delete(`/api/gensets/${id}/`);
};
const fetchGenset = (axiosAuth: any, id: any) => {
  return axiosAuth.get(`/api/gensets/${id}/`);
};

export const useFetchGensetList = ({ search, page }: any) => {
  const axiosAuth = useAxiosAuth();
  const query = generateQueryString({ search, page });

  return useQuery(['genset-list', search, page], () => fetchGensetList(axiosAuth, query), {
    keepPreviousData: true,
  });
};

export const useFetchGenset = ({ variables, onSuccessCallback, onErrorCallback }: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(['genset', variables?.id], () => fetchGenset(axiosAuth, variables?.id), {
    enabled: variables?.id ? true : false,

    onSuccess: (data) => {
      onSuccessCallback && onSuccessCallback(data);
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });
};

export const useAddGenset = (onSuccessCallback: any, onErrorCallback?: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (genset: GensetFormValues) => {
      return addGenset(axiosAuth, genset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('genset-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useEditGenset = (onSuccessCallback: any, onErrorCallback?: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: GensetFormValues & { uid: string }) => {
      return editGenset(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('genset-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useDeleteGenset = (onSuccessCallback: any, onErrorCallback: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteGenset(axiosAuth, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('genset-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
