import { AxiosRequestConfig } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';

import generateQueryString from '@/utils/generateQueryString';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchUserList = (axiosAuth: any, query: string) => {
  return axiosAuth.get(`/api/users/${query}`);
};

const addUser = (axiosAuth: any, payload: any) => {
  return axiosAuth.post(`/api/register/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const editUser = (axiosAuth: any, payload: any, id: any) => {
  return axiosAuth.patch(`/api/users/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
const editImage = (axiosAuth: any, payload: any, id: any) => {
  return axiosAuth.patch(`/api/users/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
const updatePassword = (axiosAuth: any, payload: any) => {
  return axiosAuth.post(`/api/change-password/`, payload);
};
const deleteUser = (axiosAuth: any, id: any) => {
  return axiosAuth.delete(`/api/users/${id}/`);
};
const fetchUser = (axiosAuth: any, id: any) => {
  return axiosAuth.get(`/api/users/${id}/`);
};

export const useFetchUserList = ({ page, search }: any) => {
  const axiosAuth = useAxiosAuth();
  const query = generateQueryString({ page, search });
  return useQuery(['user-list', page, search], () => fetchUserList(axiosAuth, query), {
    keepPreviousData: true,
  });
};

export const useFetchUser = ({ variables, onSuccessCallback, onErrorCallback }: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(['user', variables?.id], () => fetchUser(axiosAuth, variables?.id), {
    enabled: variables?.id ? true : false,

    onSuccess: (data) => {
      onSuccessCallback && onSuccessCallback(data);
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });
};

export const useAddUser = (onSuccessCallback: any, onErrorCallback?: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (user: any) => {
      return addUser(axiosAuth, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('user-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useEditUser = (onSuccessCallback: any, onErrorCallback?: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: ({ formData, id }: any) => {
      return editUser(axiosAuth, formData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('user-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useDeleteUser = (onSuccessCallback: any, onErrorCallback: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteUser(axiosAuth, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('user-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
export const useUpdateImage = ({ onSuccess: onSuccess, onError: onError }: any) => {
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: ({ formData, id }: any) => {
      return editImage(axiosAuth, formData, id);
    },
    onSuccess: (res) => {
      onSuccess && onSuccess(res);
    },
    onError: (error) => {
      onError && onError(error); // Call the error callback
    },
  });

  return mutation;
};
export const useUpdatePassword = ({ onSuccess: onSuccess, onError: onError }: any) => {
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: ({ formData }: any) => {
      return updatePassword(axiosAuth, formData);
    },
    onSuccess: (res) => {
      onSuccess && onSuccess(res);
    },
    onError: (error) => {
      onError && onError(error); // Call the error callback
    },
  });

  return mutation;
};
type ApiGetCallProps<TData = any, TError = any> = {
  endpoint: string;
  config?: UseQueryOptions<TData, TError>;
  queryKey: any[];
  axiosConfig?: AxiosRequestConfig;
};

export function useApiGet<TData = any, TError = any>({
  endpoint,
  config = {},
  queryKey,
  axiosConfig = {},
}: ApiGetCallProps<TData, TError>) {
  const axiosAuth = useAxiosAuth();
  const queryOptions = {
    ...config,
  };

  const query = useQuery<TData, TError>(queryKey || [endpoint], () => axiosAuth.get(endpoint, axiosConfig), {
    ...queryOptions,
  });

  return query;
}

type ApiMutationCallProps<TData = any, TError = any> = {
  endpoint: string;
  method: 'post' | 'put' | 'delete';
  config?: UseQueryOptions<TData, TError> | any;
  queryKey?: any[];
  axiosConfig?: AxiosRequestConfig;
  sendDataInParams?: boolean;
};

export function useApiMutation<TData = any, TError = any>({
  endpoint,
  method,
  config = {},
  axiosConfig = {},
  sendDataInParams = false,
}: ApiMutationCallProps<TData, TError>) {
  const axiosAuth = useAxiosAuth();
  const queryOptions = {
    ...config,
  };

  const mutation = useMutation<TData, TError, any, any>(
    (params: any) => {
      let url = endpoint;
      if (sendDataInParams) {
        // Construct URL with query params
        const queryString = Object.values(params)
          .map((key) => `/${key}`)
          .join('');
        url += `${queryString}`;
        return axiosAuth[method](url, {}, axiosConfig); // No data in the body, sending empty object
      }
      return axiosAuth[method](url, params, axiosConfig); // No data in the body, sending empty object
    },
    {
      ...queryOptions,
    } as UseMutationOptions<TData, TError>,
  );

  return mutation;
}
