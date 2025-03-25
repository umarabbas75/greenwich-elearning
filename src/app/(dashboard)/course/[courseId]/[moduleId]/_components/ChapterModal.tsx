import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { saveAs } from 'file-saver';
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
  function arrayToCommaSeparatedString(arr: any) {
    if (!Array.isArray(arr)) {
      return ''; // Return an empty string if input is not an array
    }
    return arr.join(',');
  }
  function getFileExtensionFromUrl(url: any) {
    if (!url) {
      return ''; // Return empty string for null or undefined URLs
    }

    const parts = url.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].split('?')[0]; // handle query parameters
    } else {
      return ''; // No extension found
    }
  }

  const renderDocuments = (value: any, onChange: any) => {
    const documents = value?.split(',');
    return documents?.map((item: any, index: number) => {
      return (
        <span key={item} className="flex gap-4 p-2">
          {' '}
          <a
            onClick={() => {
              saveAs(item, `Document-${index}.${getFileExtensionFromUrl(item)}`);
            }}
            href={item}
            target="_blank"
            className="text-themeBlue underline"
          >
            Document-{index}.{getFileExtensionFromUrl(item)}
          </a>
          <Trash
            className="cursor-pointer hover:text-red-500"
            onClick={() => {
              const newDocuments = documents.filter((_: any, i: any) => i !== index);
              onChange(newDocuments.join(','));
            }}
          />
        </span>
      );
    });
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
                  console.log({ value });
                  return (
                    <div className="flex flex-col space-y-2 justify-between">
                      <FormLabel className="mt-3">Document file</FormLabel>
                      <FileUploader
                        classes="upload-doc !w-full !min-w-full"
                        multiple={true}
                        handleChange={async (files: FileList | File[]) => {
                          // Convert FileList to array if needed
                          const selectedFiles = Array.isArray(files) ? files : Array.from(files);

                          if (selectedFiles && selectedFiles.length > 0) {
                            try {
                              setImageLoading(true);

                              // Upload all files in parallel
                              const uploadPromises = selectedFiles.map(async (file) => {
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('upload_preset', 'my_uploads');
                                formData.append('cloud_name', 'dp9urvlsz');

                                const response = await axios.post(
                                  'https://api.cloudinary.com/v1_1/dp9urvlsz/raw/upload',
                                  formData,
                                  {
                                    headers: {
                                      'Content-Type': 'multipart/form-data',
                                    },
                                  },
                                );

                                return response.data.url;
                              });

                              // Wait for all uploads to complete
                              const urls = await Promise.all(uploadPromises);

                              setImageLoading(false);
                              const commaSeparatedString = arrayToCommaSeparatedString(urls);
                              // Call onChange with array of URLs
                              onChange(commaSeparatedString);
                            } catch (error) {
                              setImageLoading(false);
                            }
                          }
                        }}
                        name="files" // Changed to plural since multiple files
                        value={value}
                        types={['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt']}
                      />
                      {value && (
                        <div className="flex justify-between items-start border flex-col border-gray-200 p-2 border-dashed">
                          {renderDocuments(value, onChange)}
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
