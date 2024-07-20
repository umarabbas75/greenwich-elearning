import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import BlotFormatter from 'quill-blot-formatter';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { Quill } from 'react-quill';
import * as Yup from 'yup';

import useQuillHook from '@/app/(dashboard)/course/addCourse/quill.hook';
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

const ForumModal = () => {
  const [forumState, setForumState] = useAtom(forumModalAtom);
  const { toast } = useToast();
  const [imageLoading, setImageLoading] = useState(false);

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
      onSuccess: () => {
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
      onSuccess: () => {
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
  const { reset, handleSubmit, control } = form;

  const { data, isLoading: fetchingForum } = useApiGet<any>({
    endpoint: `/forum-thread/${forumState?.data?.id}`,
    queryKey: ['get-forum-thread', forumState?.data?.id],
    config: {
      enabled: !!forumState?.data?.id,
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
    data ? editForum(payload) : addForum(payload);
  };

  const { quillRef } = useQuillHook({ fetchingCourse: fetchingForum, setImageLoading });

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
                  render={({ field: { onChange, value } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                <Controller
                  control={control}
                  name={`content`}
                  render={({ field: { onChange, value } }) => (
                    <ReactQuillComponent
                      id="quill"
                      ref={quillRef}
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
        </div>
      )}
    </Modal>
  );
};

export default ForumModal;
