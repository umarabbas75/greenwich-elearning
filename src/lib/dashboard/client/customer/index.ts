import { useMutation, useQuery, useQueryClient } from 'react-query';

import generateQueryString from '@/utils/generateQueryString';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchCustomerList = (axiosAuth: any, query: string) => {
  return axiosAuth.get(`/api/customers${query ?? ''}`);
};

const checkCustomerId = (axiosAuth: any, payload: CheckCustomerIdPayload) => {
  return axiosAuth.post(`/api/validate-customer-id/`, payload);
};

const addCustomer = (axiosAuth: any, payload: TypesCustomerFormValues) => {
  return axiosAuth.post(`/api/customers/`, payload);
};

const deleteCustomer = (axiosAuth: any, id: string) => {
  return axiosAuth.delete(`/api/customers/${id}/`);
};
const editCustomer = (axiosAuth: any, payload: any) => {
  return axiosAuth.patch(`/api/customers/${payload.uid}/`, payload);
};
const fetchCustomer = (axiosAuth: any, id: any) => {
  return axiosAuth.get(`/api/customers/${id}/`);
};

export const useFetchCustomerList = ({
  onSuccess,
  search,
  page,
  enabled = true,
}: {
  onSuccess?: any;
  search?: any;
  page?: any;
  enabled?: boolean;
} = {}) => {
  const axiosAuth = useAxiosAuth();
  const query = generateQueryString({ search, page });
  return useQuery(
    ['customer-list', search, page],
    () => fetchCustomerList(axiosAuth, query),
    {
      enabled: enabled,
      keepPreviousData: true,
      ...(onSuccess && { onSuccess: onSuccess }),
    },
  );
};

export const useFetchCustomer = ({
  variables,
  onSuccessCallback,
  onErrorCallback,
}: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(
    ['customer', variables?.id],
    () => fetchCustomer(axiosAuth, variables?.id),
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

export const useCheckCustomerId = (
  onSuccessCallback?: any,
  onErrorCallback?: any,
) => {
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: CheckCustomerIdPayload) => {
      return checkCustomerId(axiosAuth, data);
    },
    onSuccess: (data) => {
      onSuccessCallback && onSuccessCallback(data);
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useAddCustomer = (
  onSuccessCallback: any,
  onErrorCallback?: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: TypesCustomerFormValues) => {
      return addCustomer(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('customer-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useEditCustomer = (
  onSuccessCallback: any,
  onErrorCallback?: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return editCustomer(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('customer-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useDeleteCustomer = (
  onSuccessCallback: any,
  onErrorCallback: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteCustomer(axiosAuth, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('customer-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
