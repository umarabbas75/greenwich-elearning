import { useMutation, useQuery, useQueryClient } from 'react-query';

import generateQueryString from '@/utils/generateQueryString';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchGensetTypeList = (axiosAuth: any, query: string) => {
  return axiosAuth.get(`/api/genset-types/${query ?? ''}`);
};

const addGensetType = (axiosAuth: any, payload: FormData) => {
  return axiosAuth.post(`/api/genset-types/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
const deleteGensetType = (axiosAuth: any, id: string) => {
  return axiosAuth.delete(`/api/genset-types/${id}/`);
};

const editGensetType = (axiosAuth: any, payload: FormData, uid: string) => {
  return axiosAuth.patch(`/api/genset-types/${uid}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
const fetchGensetType = (axiosAuth: any, id: any) => {
  return axiosAuth.get(`/api/genset-types/${id}/`);
};

export const useFetchGensetTypeList = ({
  onSuccess,
  search,
  page,
}: {
  onSuccess?: any;
  search?: any;
  page?: any;
} = {}) => {
  const axiosAuth = useAxiosAuth();
  const query = generateQueryString({ search, page });
  return useQuery(
    ['genset-type-list', search, page],
    () => fetchGensetTypeList(axiosAuth, query),
    {
      keepPreviousData: true,
      ...(onSuccess && { onSuccess: onSuccess }),
    },
  );
};

export const useFetchGensetType = ({
  variables,
  onSuccessCallback,
  onErrorCallback,
}: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(
    ['genset-type', variables?.id],
    () => fetchGensetType(axiosAuth, variables?.id),
    {
      enabled: variables?.id ? true : false,

      onSuccess: (data) => {
        onSuccessCallback && onSuccessCallback(data);
      },
      onError: (error) => {
        onErrorCallback && onErrorCallback(error); // Call the error callback
      },
    },
  );
};

export const useAddGensetType = (
  onSuccessCallback: any,
  onErrorCallback?: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (genset: FormData) => {
      return addGensetType(axiosAuth, genset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('genset-type-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useEditGensetType = (
  onSuccessCallback: any,
  onErrorCallback?: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: ({
      editFormData,
      uid,
    }: {
      editFormData: FormData;
      uid: string;
    }) => {
      return editGensetType(axiosAuth, editFormData, uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('genset-type-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
export const useDeleteGensetType = (
  onSuccessCallback: any,
  onErrorCallback: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteGensetType(axiosAuth, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('genset-type-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
