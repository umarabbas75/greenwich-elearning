import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { forumModalAtom } from '@/store/modals';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

/* const MAX_FILE_SIZE = 102400; */

const ForumModal = () => {
  const [forumState, setForumState] = useAtom(forumModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: addForum,
    isLoading: addingForum,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/forum-thread`,
    method: 'post',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });

        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
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
    mutate: editForum,
    isLoading: editingForum,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/forum-thread/update/${forumState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });

        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
        closeModal();
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record updated successfully',
        });
      },
    },
  });
  const closeModal = () => {
    setForumState({
      ...forumState,
      status: false,
      data: null,
    });
  };
  console.log({ addForum, editForum });

  const defaultValues = {
    title: '',
    content: '',
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    content: Yup.string().required('content is required'),
  });

  const form = useForm<any>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = form;
  console.log({ errors });

  const { data, isLoading: fetchingForum } = useApiGet<any>({
    endpoint: `/forum-thread/${forumState?.data?.id}`,
    queryKey: ['get-user', forumState?.data?.id],
    config: {
      enabled: !!forumState?.data?.id,
      onSuccess: (data: any) => {
        console.log({ data });
        reset({
          ...data?.data,
        });
      },
    },
  });
  console.log({ errors });

  const onSubmit = (values: any) => {
    console.log('values', values);
    data ? editForum(values) : addForum(values);
  };

  return (
    <Modal
      open={forumState.status}
      onClose={() => {}}
      title={data ? 'Edit Forum Thread' : 'New Forum Thread'}
      className="md:!min-w-[45rem]"
    >
      {fetchingForum ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name="title"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        {/* <FormMessage>{errors?.title?.message}</FormMessage> */}
                      </FormItem>
                    );
                  }}
                />

                <Controller
                  control={control}
                  name={`content`}
                  render={({ field: { onChange, value } }) => (
                    <ReactQuill
                      id="quill"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                          ['link', 'image'],
                          ['clean'],
                        ],
                      }}
                      // style={{ minHeight: '200px' }}
                      value={value}
                      onChange={(data: string) => {
                        onChange(data);
                      }}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton loading={addingForum || editingForum} type="submit" variant="default">
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

export default ForumModal;
