import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { addChapterModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

type ChapterFormTypes = {
  title: string;
  description: string;
  pdfFile: string;
};

const ChapterModal = () => {
  const [chapterModalState, setChapterModalState] = useAtom(addChapterModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const { moduleId } = params || {};
  const {
    mutate: addChapter,
    isLoading: addingChapter,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/courses/chapter`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-chapters'] });
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
    mutate: editChapter,
    isLoading: editingChapter,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/courses/chapter/${chapterModalState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-chapters'] });
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
    setChapterModalState({
      ...chapterModalState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    title: '',
    description: '',
    pdfFile: '',
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    description: Yup.string().required('description is required'),
    pdfFile: Yup.string().notRequired().nullable(),
  });

  const form = useForm<ChapterFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control, reset } = form;

  const { data, isLoading: fetchingChapter } = useApiGet<any>({
    endpoint: `/courses/chapter/${chapterModalState?.data?.id}`,
    queryKey: ['get-chapter', chapterModalState?.data?.id],
    config: {
      enabled: !!chapterModalState?.data?.id,
      onSuccess: (data: any) => {
        reset({
          ...data?.data,
        });
      },
    },
  });

  const onSubmit = (values: ChapterFormTypes) => {
    data ? editChapter(values) : addChapter({ ...values, id: moduleId });
  };

  return (
    <Modal open={chapterModalState.status} onClose={() => {}} title={data ? 'Edit Element' : 'New Element'}>
      {fetchingChapter ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                name="pdfFile"
                render={({ field: { onChange, value }, formState: { errors } }) => {
                  return (
                    <FormItem>
                      <FormLabel>PDF file</FormLabel>
                      <FormControl>
                        <Input onChange={onChange} value={value} />
                      </FormControl>

                      <FormMessage>{errors.pdfFile?.message}</FormMessage>
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
                        <Textarea onChange={onChange} value={value} />
                      </FormControl>

                      <FormMessage>{errors.description?.message}</FormMessage>
                    </FormItem>
                  );
                }}
              />

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton loading={addingChapter || editingChapter} type="submit" variant="default">
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

export default ChapterModal;
