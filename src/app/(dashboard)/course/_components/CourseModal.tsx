import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import {
  useAddUser,
  useEditUser,
  useFetchUser,
} from '@/lib/dashboard/client/user';
import { addCourseModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

type UserFormTypes = {
  title: string;
  description: string;
};

const CourseModal = () => {
  const [courseModalState, setCourseModalState] = useAtom(addCourseModalAtom);
  const { toast } = useToast();

  const handleSuccess = () => {
    closeModal();
    toast({
      variant: 'success',
      // title: 'Success ',
      description: 'Record addedd successfully',
    });
  };

  const {
    mutate: addCourse,
    isLoading: addingCourse,
    isError: isAddError,
    error: addError,
  } = useAddUser(handleSuccess);
  const {
    mutate: editCourse,
    isLoading: editingCourse,
    isError: isEditError,
    error: editError,
  } = useEditUser(handleSuccess);

  console.log({ addCourse, editCourse });

  const closeModal = () => {
    setCourseModalState({
      ...courseModalState,
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

  const form = useForm<UserFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control } = form;

  const { data, isLoading: fetchingUser } = useFetchUser({
    variables: {
      id: courseModalState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      form.reset({
        ...data,
        customer: data?.customer,
      });
    },
  });

  const onSubmit = (values: UserFormTypes) => {
    console.log('values', values);
  };

  return (
    <Modal
      open={courseModalState.status}
      onClose={() => {}}
      title={data ? 'Edit Course' : 'New Course'}
    >
      {fetchingUser ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && (
            <AlertDestructive error={editError || addError} />
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="title"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
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
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
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

                <LoadingButton
                  loading={addingCourse || editingCourse}
                  type="submit"
                  variant="default"
                >
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

export default CourseModal;
