import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
import BlotFormatter from 'quill-blot-formatter';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { Quill } from 'react-quill';
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
import { addSectionModalAtom } from '@/store/modals';

import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
const Image = Quill.import('formats/image');
const ATTRIBUTES: any = [
  'alt',
  'height',
  'width',
  'class',
  'style', // Had to add this line because the style was inlined
];

class CustomImage extends Image {
  static formats(domNode: any) {
    return ATTRIBUTES.reduce((formats: any, attribute: any) => {
      const copy = { ...formats };

      if (domNode.hasAttribute(attribute)) {
        copy[attribute] = domNode.getAttribute(attribute);
      }

      return copy;
    }, {});
  }

  format(name: any, value: any) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
const ReactQuillComponent = typeof window === 'object' ? require('react-quill') : () => false;

// Register Blot Formatter
Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('formats/image', CustomImage);
/* const MAX_FILE_SIZE = 102400; */

type SectionFormTypes = {
  title: string;
  description: string;
};

const SectionModal = () => {
  const [imageLoading, setImageLoading] = useState(false);

  const [sectionModalState, setSectionModalState] = useAtom(addSectionModalAtom);
  const { toast } = useToast();
  const quillRef: any = useRef(null);
  const queryClient = useQueryClient();
  const params = useParams();
  const { chapterId, moduleId } = params || {};

  const {
    mutate: addSection,
    isLoading: addingSection,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/courses/section`,
    method: 'post',
    config: {
      onSuccess: () => {
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
    endpoint: `/courses/section/update/${sectionModalState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
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

  function getFirst20CharactersExcludingImgTags(inputString: string) {
    // Remove all img tags and their content
    const stringWithoutImgTags = inputString.replace(/<img[^>]*>/g, '');

    // Extract the first 20 characters from the remaining string
    const first20Characters = stringWithoutImgTags.substring(0, 350);

    return first20Characters;
  }

  const { data, isLoading: fetchingChapter } = useApiGet<any>({
    endpoint: `/courses/section/${sectionModalState?.data?.id}`,
    queryKey: ['get-chapter', sectionModalState?.data?.id],
    config: {
      enabled: !!sectionModalState?.data?.id,
      onSuccess: (data: any) => {
        form.reset({
          ...data?.data,
        });
      },
    },
  });

  const onSubmit = (values: SectionFormTypes) => {
    const shortDesc = getFirst20CharactersExcludingImgTags(values?.description);

    data
      ? editSection({ ...values, shortDescription: shortDesc, moduleId: moduleId })
      : addSection({ ...values, shortDescription: shortDesc, id: chapterId, moduleId: moduleId });
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
  }, [quillRef, quillRef.current, fetchingChapter]);

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

  return (
    <Modal
      className="md:!min-w-[55rem]"
      open={sectionModalState.status}
      onClose={() => {}}
      title={data ? 'Edit Lesson' : 'New Lesson'}
    >
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
                    <ReactQuillComponent
                      id="quill"
                      ref={quillRef}
                      modules={{
                        toolbar: [
                          [{ header: '1' }, { header: '2' }, { font: [] }],
                          [{ size: [] }],

                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                          [{ align: [] }],
                          ['link', 'image', 'video'],
                          [{ color: [] }, { background: [] }],
                          ['clean'],
                        ],
                        blotFormatter: {},
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

                <LoadingButton loading={addingSection || editingSection} type="submit" variant="default">
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

export default SectionModal;
