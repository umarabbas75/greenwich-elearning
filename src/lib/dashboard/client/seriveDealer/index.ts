import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import generateQueryString from '@/utils/generateQueryString';
import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchServiceDealerList = (axiosAuth: any, query: any) => {
  return axiosAuth.get(`/api/service-dealers/${query ?? ''}`);
};
const fetchAddressList = (searchTerm: any) => {
  return axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}&limit=5`,
  );
};

const addServiceDealer = (axiosAuth: any, payload: any) => {
  return axiosAuth.post(`/api/service-dealers/`, payload);
};

const deleteServiceDealer = (axiosAuth: any, id: string) => {
  return axiosAuth.delete(`/api/service-dealers/${id}/`);
};

const editServiceDealer = (
  axiosAuth: any,
  payload: ServiceDealerFormValues & { uid: string },
) => {
  return axiosAuth.patch(`/api/service-dealers/${payload.uid}/`, payload);
};
const fetchServiceDealer = (axiosAuth: any, id: any) => {
  return axiosAuth.get(`/api/service-dealers/${id}/`);
};

export const useFetchServiceDealerList = ({ page, search }: any) => {
  const axiosAuth = useAxiosAuth();
  const query = generateQueryString({ page, search });
  return useQuery(
    ['service-dealer-list', page, search],
    () => fetchServiceDealerList(axiosAuth, query),
    {
      keepPreviousData: true,
    },
  );
};

export const useFetchServiceDealer = ({
  variables,
  onSuccessCallback,
  onErrorCallback,
}: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(
    ['service-dealer', variables?.id],
    () => fetchServiceDealer(axiosAuth, variables?.id),
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

export const useAddServiceDealer = (
  onSuccessCallback: any,
  onErrorCallback?: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return addServiceDealer(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('service-dealer-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useEditServiceDealer = (
  onSuccessCallback: any,
  onErrorCallback?: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data: ServiceDealerFormValues & { uid: string }) => {
      return editServiceDealer(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('service-dealer-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
export const useDeleteServiceDealer = (
  onSuccessCallback: any,
  onErrorCallback: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteServiceDealer(axiosAuth, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('service-dealer-list');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useFetchAddressList = ({ search }: any) => {
  return useQuery(['address-list', search], () => fetchAddressList(search), {
    keepPreviousData: true,
  });
};
