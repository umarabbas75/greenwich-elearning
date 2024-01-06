import { useMutation, useQueryClient } from 'react-query';

import useAxiosAuth from '@/utils/hooks/useAxiosAuth';

const addCategory = (axiosAuth: any, payload: any) => {
  return axiosAuth.post(`/inventory/api/product-category/`, payload);
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
      queryClient.invalidateQueries('gensets');
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error) => {
      onErrorCallback && onErrorCallback(error); // Call the error callback
    },
  });

  return mutation;
};
