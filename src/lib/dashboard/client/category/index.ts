import { useMutation, useQuery, useQueryClient } from 'react-query';

import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const fetchCategoriesData = (axiosAuth: any, variables: any) => {
  return axiosAuth.get(
    `/inventory/api/product-category/?page=${
      variables?.pagination?.pageIndex + 1
    }&search=${variables?.search ?? ''}`,
  );
};

const addCategory = (axiosAuth: any, payload: any) => {
  return axiosAuth.post(`/inventory/api/product-category/`, payload);
};
const editCategory = (axiosAuth: any, payload: any) => {
  return axiosAuth.patch(
    `/inventory/api/product-category/${payload.uid}/`,
    payload,
  );
};
const fetchCategory = (axiosAuth: any, id: any) => {
  return axiosAuth.get(`/inventory/api/product-category/${id}/`);
};

export const useCategoriesData = ({ variables }: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(
    ['categories', variables?.pagination?.pageIndex, variables?.search],
    () => fetchCategoriesData(axiosAuth, variables),
    {
      keepPreviousData: true,
    },
  );
};

export const useCategoryData = ({
  variables,
  onSuccessCallback,
  onErrorCallback,
}: any) => {
  const axiosAuth = useAxiosAuth();
  return useQuery(
    ['category', variables?.id],
    () => fetchCategory(axiosAuth, variables?.id),
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

export const useAddCategory = (
  onSuccessCallback: any,
  onErrorCallback: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return addCategory(axiosAuth, newTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};

export const useEditCategory = (
  onSuccessCallback: any,
  onErrorCallback: any,
) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const mutation = useMutation({
    mutationFn: (data) => {
      return editCategory(axiosAuth, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
