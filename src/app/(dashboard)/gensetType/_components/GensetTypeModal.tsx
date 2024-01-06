import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { DeleteIcon } from 'lucide-react';
import { FileUploader } from 'react-drag-drop-files';
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
  useAddGensetType,
  useEditGensetType,
  useFetchGensetType,
} from '@/lib/dashboard/client/gensetType';
import { gensetTypeModalAtom } from '@/store/modals';
import getFileName from '@/utils/getFileName';

const validationSchema = Yup.object().shape({
  description: Yup.string().required('description is required'),
  name: Yup.string().required('name is required'),
  image: Yup.mixed().test('file', 'Image is required', (value) => {
    return (
      value instanceof File ||
      (typeof value === 'string' && value.includes('http'))
    );
  }),
});
export type TypesGensetFormValues = Yup.InferType<typeof validationSchema>;

const GensetTypeModal = () => {
  const [genTypeState, setGenTypeState] = useAtom(gensetTypeModalAtom);
  const { toast } = useToast();

  const defaultValues = {
    image: {},
    name: '',
    description: '',
  };

  const form = useForm<TypesGensetFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { reset, handleSubmit, control } = form;

  const handleSuccess = () => {
    reset();
    closeModal();
    toast({
      variant: 'success',
      description: 'Record Saved Successfully!',
    });
  };

  const {
    mutate: addGensetType,
    isLoading: addingGensetType,
    isError: isAddError,
    error: addError,
  } = useAddGensetType(handleSuccess);
  const {
    mutate: editGensetType,
    isLoading: editingGensetType,
    isError: isEditError,
    error: editError,
  } = useEditGensetType(handleSuccess);

  const closeModal = () => {
    setGenTypeState({
      ...genTypeState,
      status: false,
      data: null,
    });
  };

  const { data, isLoading: fetchingGenset } = useFetchGensetType({
    variables: {
      id: genTypeState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      reset(data);
    },
  });

  const onSubmit = (values: TypesGensetFormValues) => {
    // const payload = {
    //   ...values,
    //   uid: genTypeState?.data?.id,
    // };
    const uid = genTypeState?.data?.id;
    const addFormData = new FormData();
    addFormData.append('name', values.name);
    addFormData.append('description', values.description);
    if (values.image instanceof File) {
      addFormData.append('image', values.image);
    }
    const editFormData = new FormData();
    editFormData.append('name', values.name);
    editFormData.append('description', values.description);
    if (values.image instanceof File) {
      editFormData.append('image', values.image);
    }

    data ? editGensetType({ editFormData, uid }) : addGensetType(addFormData);
  };

  return (
    <Modal
      open={genTypeState.status}
      onClose={() => {}}
      title={data ? 'Edit Genset Type' : 'New Genset Type'}
    >
      {fetchingGenset ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && (
            <AlertDestructive error={editError || addError} />
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.name?.message}</FormMessage>
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
                <FormField
                  control={control}
                  name="image"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <div className="flex flex-col">
                        <FileUploader
                          multiple={false}
                          handleChange={onChange}
                          name="file"
                          value={value}
                          types={['jpeg', 'png', 'jpg', 'svg+xml', 'webp']}
                        />
                        <FormMessage>{errors.image?.message}</FormMessage>
                        {(typeof value === 'string' ||
                          value instanceof File) && (
                          <div className="flex justify-between mt-1 p-2 hover:bg-gray-200 cursor-pointer">
                            {value instanceof File && (
                              <span> {value.name}</span>
                            )}
                            {typeof value === 'string' && (
                              <span>{getFileName(value)}</span>
                            )}

                            <DeleteIcon
                              className="cursor-pointer"
                              onClick={() => onChange({})}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton
                  loading={addingGensetType || editingGensetType}
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

export default GensetTypeModal;
