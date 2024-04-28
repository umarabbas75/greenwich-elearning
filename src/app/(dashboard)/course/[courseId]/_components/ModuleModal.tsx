import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { addModuleModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

type ModuleFormTypes = {
  title: string;
  description: string;
  courseId: string;
};

const ModuleModal = ({ courseId }: { courseId: string }) => {
  const [moduleModalState, setModuleModalState] = useAtom(addModuleModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: addModule,
    isLoading: addingModule,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/courses/module`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-modules'] });
        closeModal();
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record added successfully',
        });
      },
    },
  });

  const {
    mutate: editModule,
    isLoading: editingModule,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/courses/module/${moduleModalState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-modules'] });
        closeModal();
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record added successfully',
        });
      },
    },
  });

  const closeModal = () => {
    setModuleModalState({
      ...moduleModalState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    title: '',
    description: '',
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    description: Yup.string().required('description is required'),
  });

  const form = useForm<ModuleFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control, reset } = form;

  const { data, isLoading: fetchingModule } = useApiGet<any>({
    endpoint: `/courses/module/${moduleModalState?.data?.id}`,
    queryKey: ['get-module', moduleModalState?.data?.id],
    config: {
      enabled: !!moduleModalState?.data?.id,
      onSuccess: (data: any) => {
        reset({
          ...data?.data,
        });
      },
    },
  });

  const onSubmit = (values: ModuleFormTypes) => {
    data ? editModule(values) : addModule({ ...values, id: courseId });
  };

  return (
    <Modal open={moduleModalState.status} onClose={() => {}} title={data ? 'Edit Module' : 'New Module'}>
      {fetchingModule ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="title"
                  render={({ field: { onChange, value }, formState: { errors } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.title?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field: { onChange, value }, formState: { errors } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.description?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton loading={addingModule || editingModule} type="submit" variant="default">
                  Submit
                </LoadingButton>
              </div>
            </form>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default ModuleModal;
