import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
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
import { useApiMutation, useFetchUser } from '@/lib/dashboard/client/user';
import { addSectionModalAtom } from '@/store/modals';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

/* const MAX_FILE_SIZE = 102400; */

type SectionFormTypes = {
  title: string;
  description: string;
};

const SectionModal = () => {
  const [sectionModalState, setSectionModalState] = useAtom(addSectionModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const { chapterId } = params || {};

  const {
    mutate: addSection,
    isLoading: addingSection,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/courses/section`,
    method: 'post',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });

        queryClient.invalidateQueries({ queryKey: ['get-sections'] });
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
    mutate: editSection,
    isLoading: editingSection,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/courses/section/${sectionModalState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });

        queryClient.invalidateQueries({ queryKey: ['get-sections'] });
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
    setSectionModalState({
      ...sectionModalState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    title: '',
    content: '',
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    description: Yup.string().required('description is required'),
  });

  const form = useForm<SectionFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control } = form;

  const { data, isLoading: fetchingUser } = useFetchUser({
    variables: {
      id: sectionModalState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      form.reset({
        ...data,
        customer: data?.customer,
      });
    },
  });

  const onSubmit = (values: SectionFormTypes) => {
    data ? editSection(values) : addSection({ ...values, id: chapterId });
  };

  return (
    <Modal open={sectionModalState.status} onClose={() => {}} title={data ? 'Edit Section' : 'New Section'}>
      {fetchingUser ? (
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

                <Controller
                  control={control}
                  name={`description`}
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
                      style={{ minHeight: '200px' }}
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

                <LoadingButton loading={addingSection || editingSection} type="submit" variant="default">
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

export default SectionModal;
