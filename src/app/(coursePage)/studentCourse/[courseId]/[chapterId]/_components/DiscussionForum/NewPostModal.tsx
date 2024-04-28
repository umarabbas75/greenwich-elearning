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
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { createNewPostModalAtom } from '@/store/modals';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';

/* const MAX_FILE_SIZE = 102400; */

const NewPostModal = () => {
  const [newPostModalState, setCreateNewPostModalAtom] = useAtom(createNewPostModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: addPost,
    isLoading: addingPost,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/courses/post/${newPostModalState.data?.courseId}`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
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
    mutate: editPost,
    isLoading: editingPost,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/courses/post/${newPostModalState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
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
    setCreateNewPostModalAtom({
      ...newPostModalState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    title: '',
    content: '',
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('post title is required'),
    content: Yup.string().required('post content is required'),
  });

  const form = useForm<any>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { reset, handleSubmit, control } = form;

  const { data, isLoading: fetchingPost } = useApiGet<any>({
    endpoint: `/courses/post/${newPostModalState?.data?.id}`,
    queryKey: ['post', newPostModalState?.data?.id],
    config: {
      enabled: !!newPostModalState?.data?.id,
      onSuccess: (data: any) => {
        reset({
          ...data?.data,
        });
      },
    },
  });

  const onSubmit = (values: any) => {
    const payload = {
      title: values?.title,
      content: values?.content,
    };
    data ? editPost(payload) : addPost(values);
  };

  return (
    <Modal
      className="md:!min-w-[45rem]"
      open={newPostModalState.status}
      onClose={() => {}}
      title={data ? 'Edit Post' : 'New Post'}
    >
      {fetchingPost ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

                      {/* <FormMessage>{errors.title?.message}</FormMessage> */}
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={control}
                name="content"
                render={({ field: { onChange, value } }) => {
                  return (
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
                  );
                }}
              />

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton loading={addingPost || editingPost} type="submit" variant="default">
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

export default NewPostModal;
