'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useAtom } from 'jotai';
import { ArrowLeft, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Spinner from '@/components/common/Spinner';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { addCourseModalAtom } from '@/store/modals';

import Assessment from './FormFields/Assessment';
import Resources from './FormFields/Resources';
import Syllabus from './FormFields/Syllabus';

// const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const ReactQuill: any = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    const { default: BlotFormatter } = await import('quill-blot-formatter');
    RQ.Quill.register('modules/blotFormatter', BlotFormatter);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  },
);

type Syllabus = {
  file: string;
  isSeen: boolean;
};

type CourseFormTypes = {
  title: string;
  description: string;
  image: string;
  overview: string;
  assessment: string;
  duration: string;
  syllabus: Syllabus[];
  assessments: Syllabus[];
  resources: Syllabus[];
};

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [courseModalState] = useAtom(addCourseModalAtom);
  const quillRef: any = useRef(null);

  const [tabValue, setTabValue] = useState('default');
  const [imageLoading, setImageLoading] = useState(false);

  // useEffect(() => {
  //   return () => {
  //     setCourseModalState({ data: null, status: false });
  //   };
  // }, []);

  const {
    mutate: editCourse,
    isLoading: editingCourse,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/courses/${courseModalState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-courses'] });
        router.push('/course');
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record updated successfully',
        });
      },
    },
  });
  const defaultValues = {
    title: '',
    description: '',
    overview: '',
    resourcesOverview: '',
    assessment: '',
    syllabusOverview: '',
    // syllabus: [
    //   {
    //     file: '',
    //     name: '',
    //     type: '',
    //   },
    // ],
    // assessments: [
    //   {
    //     file: '',
    //     name: '',
    //     type: '',
    //   },
    // ],
    // resources: [
    //   {
    //     file: '',
    //     name: '',
    //     type: '',
    //   },
    // ],
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    description: Yup.string().required('description is required'),
    image: Yup.string().required('course image is required'),
    duration: Yup.string().required('duration is required'),
  });

  const form = useForm<CourseFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const {
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    watch,
    getValues,
    formState: { errors },
  } = form;

  const {
    mutate: addCourse,
    isLoading: addingCourse,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/courses`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-courses'] });
        router.push('/course');
        reset();
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record added successfully',
        });
      },
    },
  });

  const { data, isLoading: fetchingCourse } = useApiGet<any>({
    endpoint: `/courses/${courseModalState?.data?.id}`,
    queryKey: ['get-course', courseModalState?.data?.id],
    config: {
      enabled: !!courseModalState?.data?.id,
      onSuccess: (data: any) => {
        reset({
          ...data?.data,
        });
      },
    },
  });
  const imageHandler = () => {
    try {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const selectedFile = input?.files?.[0];
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('upload_preset', 'my_uploads');
          formData.append('cloud_name', 'dp9urvlsz');
          try {
            setImageLoading(true);
            const response = await axios.post('https://api.cloudinary.com/v1/image/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const url = response.data.url;
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', url);
            setImageLoading(false);
          } catch (error) {
            setImageLoading(false);

            console.error('Error uploading image:', error);
          }
        }
      };
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (quillRef.current) {
      try {
        const quill = quillRef.current?.getEditor();
        quill.getModule('toolbar').addHandler('image', imageHandler);
      } catch (error) {
        console.log({ error });
      }
    }
  }, [quillRef, quillRef.current, fetchingCourse]);

  const {
    fields: syllabusFields,
    append: appendSyllabus,
    remove: removeSyllabus,
  } = useFieldArray({
    control,
    name: 'syllabus',
  });

  const watchSyllabus = watch('syllabus');
  const syllabus = syllabusFields.map((field, index) => {
    return {
      ...field,
      ...watchSyllabus?.[index],
    };
  });

  const {
    fields: assessmentFields,
    append: appendAssessment,
    remove: removeAssessment,
  } = useFieldArray({
    control,
    name: 'assessments',
  });

  const watchAssessments = watch('assessments');
  const assessments = assessmentFields.map((field, index) => {
    return {
      ...field,
      ...watchAssessments?.[index],
    };
  });
  const {
    fields: resourcesFields,
    append: appendResources,
    remove: removeResources,
  } = useFieldArray({
    control,
    name: 'resources',
  });

  const watchResources = watch('resources');
  const resources = resourcesFields.map((field, index) => {
    return {
      ...field,
      ...watchResources?.[index],
    };
  });
  console.log('getValues', getValues());

  const onSubmit = (values: any) => {
    values.resources = getValues('resources');
    values.assessments = getValues('assessments');
    values.syllabus = getValues('syllabus');
    if (data) {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { id, ...rest } = values;
      editCourse(rest);
    } else {
      addCourse(values);
    }
  };
  console.log({ errors });
  if (fetchingCourse) {
    return <Spinner />;
  }
  return (
    <>
      <button
        className="flex gap-1"
        onClick={() => {
          router.push('/course');
        }}
      >
        <ArrowLeft />
        back
      </button>

      <div className=" w-[98%] sm:w-[90%] xl:w-3/4 m-auto mt-8 relative">
        {imageLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#ffffff36] z-[99999999]">
            <div className="w-full h-full flex justify-center items-center">
              <Spinner className="!text-primary w-16 h-16" />
            </div>
          </div>
        )}
        {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-4">
              <button
                type="button"
                onClick={() => {
                  setTabValue('default');
                }}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${
                  tabValue === 'default' ? '!bg-gray-400 text text-white' : ''
                }`}
              >
                Details
              </button>{' '}
              <button
                type="button"
                onClick={() => {
                  setTabValue('syllabus');
                }}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${
                  tabValue === 'syllabus' ? '!bg-gray-400 text text-white' : ''
                }`}
              >
                Syllabus
              </button>{' '}
              <button
                type="button"
                onClick={() => {
                  setTabValue('assessment');
                }}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${
                  tabValue === 'assessment' ? '!bg-gray-400 text text-white' : ''
                }`}
              >
                Assessment
              </button>{' '}
              <button
                type="button"
                onClick={() => {
                  setTabValue('resources');
                }}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${
                  tabValue === 'resources' ? '!bg-gray-400 text text-white' : ''
                }`}
              >
                Resources
              </button>
            </div>

            {tabValue === 'default' && (
              <>
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
                    name="duration"
                    render={({ field: { onChange, value }, formState: { errors } }) => {
                      return (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input onChange={onChange} value={value} />
                          </FormControl>

                          <FormMessage>{errors.duration?.message}</FormMessage>
                        </FormItem>
                      );
                    }}
                  />
                  <div className="col-span-2">
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

                  <div className="col-span-2">
                    <Controller
                      control={control}
                      name="image"
                      render={({ field: { onChange, value }, formState: { errors } }) => {
                        return (
                          <div className="flex flex-col space-y-2 justify-between">
                            <FormLabel className="mt-3">Image</FormLabel>
                            <FileUploader
                              multiple={false}
                              onSizeError={(err: any) => {
                                setError('image', { message: `${err}, max size allowed is 0.5mb` });
                              }}
                              handleChange={async (value: any) => {
                                clearErrors(['image']);
                                const selectedFile = value;
                                if (selectedFile) {
                                  const formData = new FormData();
                                  formData.append('file', selectedFile);
                                  formData.append('upload_preset', 'my_uploads');
                                  formData.append('cloud_name', 'dp9urvlsz');
                                  try {
                                    setImageLoading(true);
                                    const response = await axios.post(
                                      'https://api.cloudinary.com/v1/image/upload',
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
                              types={['jpeg', 'png', 'jpg', 'svg+xml', 'webp']}
                            />
                            <FormMessage>{errors.image?.message}</FormMessage>
                            {value && (
                              <div className="flex justify-between items-center border border-gray-200 p-2 border-dashed">
                                <img src={value} className="w-12 h-12 rounded-full" alt="" />
                                <Trash
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() => {
                                    onChange('');
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormLabel className="mb-3 block">Overview</FormLabel>

                    <Controller
                      control={control}
                      name={`overview`}
                      render={({ field: { onChange, value } }) => (
                        <ReactQuill
                          // id={'overview'}
                          forwardedRef={quillRef}
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                              ['link', 'image'],
                              ['clean'],
                            ],
                            blotFormatter: {},
                          }}
                          value={value}
                          onChange={(data: string) => {
                            onChange(data);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {tabValue === 'syllabus' && (
              <>
                <Syllabus
                  control={control}
                  syllabus={syllabus}
                  appendSyllabus={appendSyllabus}
                  removeSyllabus={removeSyllabus}
                />
              </>
            )}
            {tabValue === 'assessment' && (
              <>
                <Assessment
                  control={control}
                  assessments={assessments}
                  appendAssessment={appendAssessment}
                  removeAssessment={removeAssessment}
                />
              </>
            )}
            {tabValue === 'resources' && (
              <>
                <Resources
                  control={control}
                  resources={resources}
                  appendResources={appendResources}
                  removeResources={removeResources}
                />
              </>
            )}

            <div className="flex items-center justify-end gap-2">
              <LoadingButton loading={addingCourse || editingCourse} type="submit" variant="default">
                Submit
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Page;
