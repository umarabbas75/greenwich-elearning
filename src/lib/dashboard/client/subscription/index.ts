import { useMutation, useQuery, useQueryClient } from 'react-query';

import generateQueryString from '@/utils/generateQueryString';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchSubscriptionList = (axiosAuth: any, query: string) => {
  return axiosAuth.get(`/api/subscriptions/${query ?? ''}`);
};

const addSubscription = (axiosAuth: any, payload: any) => {
  return axiosAuth.post(`/api/subscriptions/`, payload);
};
const deleteSubscription = (axiosAuth: any, id: string) => {
  return axiosAuth.delete(`/api/subscriptions/${id}/`);
};
const editSubscription = (axiosAuth: any, payload: SubscriptionFormTypes & { uid: string }) => {
  return axiosAuth.patch(`/api/subscriptions/${payload.uid}/`, payload);
};
const fetchSubscription = (axiosAuth: any, id: any) => {
  return axiosAuth.get(`/api/subscriptions/${id}/`);
};
const fetchSubscriptionFeatures = (axiosAuth: any) => {
  return axiosAuth.get(`/api/features/ `);
};

export const useFetchSubscriptionList = ({
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

  return useQuery(['subscription-list', search, page], () => fetchSubscriptionList(axiosAuth, query), {
    keepPreviousData: true,
    ...(onSuccess && { onSuccess: onSuccess }),
  });
};

export const useFetchSubscription = ({ variables, onSuccessCallback, onErrorCallback }: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(['subscription', variables?.id], () => fetchSubscription(axiosAuth, variables?.id), {
    enabled: variables?.id ? true : false,

    onSuccess: (data) => {
      onSuccessCallback && onSuccessCallback(data);
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });
};
export const useFetchFeatures = () => {
  const axiosAuth = useAxiosAuth();
  return useQuery(['subscription-features'], () => fetchSubscriptionFeatures(axiosAuth));
};

export const useAddSubscription = (onSuccessCallback: any, onErrorCallback: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (record: any) => {
      return addSubscription(axiosAuth, record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('subscription-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useEditSubscription = (onSuccessCallback: any, onErrorCallback: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: SubscriptionFormTypes & { uid: string }) => {
      return editSubscription(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('subscription-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
export const useDeleteSubscription = (onSuccessCallback: any, onErrorCallback: any) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteSubscription(axiosAuth, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('subscription-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
