import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAtom } from 'jotai';
import { Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
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
  const [imageLoading, setImageLoading] = useState(false);

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
    pdfFile: Yup.string().url('invalid url').notRequired().nullable(),
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
        <div className="relative">
          {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
          {imageLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#ffffff36] z-[99999999]">
              <div className="w-full h-full flex justify-center items-center">
                <Spinner className="!text-primary w-16 h-16" />
              </div>
            </div>
          )}
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
                render={({ field: { onChange, value } }) => {
                  return (
                    <div className="flex flex-col space-y-2 justify-between">
                      <FormLabel className="mt-3">Document file</FormLabel>
                      <FileUploader
                        classes="upload-doc !w-full !min-w-full"
                        multiple={false}
                        handleChange={async (value: any) => {
                          const selectedFile = value;
                          if (selectedFile) {
                            const formData = new FormData();
                            formData.append('file', selectedFile);
                            formData.append('upload_preset', 'my_uploads');
                            formData.append('cloud_name', 'dp9urvlsz');
                            try {
                              setImageLoading(true);
                              const response = await axios.post(
                                'https://api.cloudinary.com/v1/raw/upload',
                                formData,
                                {
                                  headers: {
                                    'Content-Type': 'multipart/form-data',
                                  },
                                },
                              );
                              setImageLoading(false);
                              const { url } = response.data;
                              onChange(url);
                            } catch (error) {
                              setImageLoading(false);
                              console.error('Error uploading image:', error);
                            }
                          }
                        }}
                        name="file"
                        value={value}
                        // disabled={true}
                        types={['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt']} // Add supported file types here
                      />
                      {value && (
                        <div className="flex justify-between items-center border border-gray-200 p-2 border-dashed">
                          <a href={value} target="_blank" className="text-themeBlue underline">
                            Document
                          </a>
                          <Trash
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => {
                              onChange('');
                            }}
                          />
                        </div>
                      )}
                      {imageLoading && <Spinner />}
                    </div>
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
        </div>
      )}
    </Modal>
  );
};

export default ChapterModal;
