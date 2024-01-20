import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { FileUploader } from 'react-drag-drop-files';
import { Controller, useForm } from 'react-hook-form';
import { CountryData } from 'react-phone-input-2';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import PhoneInput2 from '@/components/common/PhoneInput2';
import ReactSelect from '@/components/common/ReactSelect';
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
  useAddUser,
  useEditUser,
  useFetchUser,
} from '@/lib/dashboard/client/user';
import { userModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

type UserFormTypes = {
  email?: string | undefined;
  password?: string | undefined;
  role: string;
  photo: null | undefined | string;
  firstName: string;
  lastName: string;
  phone: string;
};

const UserModal = () => {
  const [userState, setUserState] = useAtom(userModalAtom);
  const { toast } = useToast();

  const handleSuccess = () => {
    closeModal();
    toast({
      variant: 'success',
      // title: 'Success ',
      description: 'Record addedd successfully',
    });
  };

  const {
    mutate: addUser,
    isLoading: addingUser,
    isError: isAddError,
    error: addError,
  } = useAddUser(handleSuccess);
  const {
    mutate: editUser,
    isLoading: editingUser,
    isError: isEditError,
    error: editError,
  } = useEditUser(handleSuccess);

  const closeModal = () => {
    setUserState({
      ...userState,
      status: false,
      data: null,
    });
  };
  const roles = [
    {
      label: 'Student',
      value: 'student',
    },
    {
      label: 'admin',
      value: 'admin',
    },
  ];

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    photo: null,
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('first name is required'),
    lastName: Yup.string().required('last name is required'),

    email: Yup.string().email('Invalid email').required('phone is required'),
    phone: Yup.string().required('phone is required'),
    location: Yup.mixed().required('Address is required'),
    password: Yup.string().when('uid', {
      is: () => !!userState?.data?.id,
      then: () => Yup.string().notRequired(),
      otherwise: () => Yup.string().required('password is required'),
    }),
    role: Yup.string().required('role is required'),
    photo: Yup.mixed().required('Required').nullable(),
  });

  const form = useForm<UserFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control } = form;

  const { data, isLoading: fetchingUser } = useFetchUser({
    variables: {
      id: userState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      console.log('dataaa', data);
      form.reset({
        ...data,
        customer: data?.customer,
      });
    },
  });

  const onSubmit = (values: UserFormTypes) => {
    console.log('values', values);
    const addFormData = new FormData();
    addFormData.append('email', values.email as string);
    addFormData.append('password', values.password as string);
    addFormData.append('role', values.role);
    values.photo &&
      !(typeof values.photo === 'string' && values.photo?.includes('http')) &&
      addFormData.append('photo', values.photo as any);

    addFormData.append('firstName', values.firstName);
    addFormData.append('lastName', values.lastName);
    addFormData.append('phone', values.phone);

    const editFormData = new FormData();
    editFormData.append('role', values.role);
    editFormData.append('firstName', values.firstName);
    editFormData.append('lastName', values.lastName);
    editFormData.append('phone', values.phone);
    values.photo &&
      !(typeof values.photo === 'string' && values.photo?.includes('http')) &&
      editFormData.append('photo', values.photo as any);

    data
      ? editUser({ formData: editFormData, id: userState?.data?.id })
      : addUser(addFormData);
  };

  return (
    <Modal
      open={userState.status}
      onClose={() => {}}
      title={data ? 'Edit User' : 'New User'}
    >
      {fetchingUser ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && (
            <AlertDestructive error={editError || addError} />
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="firstName"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.firstName?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name="lastName"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.lastName?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                {!data && (
                  <FormField
                    control={control}
                    name="email"
                    render={({
                      field: { onChange, value },
                      formState: { errors },
                    }) => {
                      return (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input onChange={onChange} value={value} />
                          </FormControl>

                          <FormMessage>{errors.email?.message}</FormMessage>
                        </FormItem>
                      );
                    }}
                  />
                )}
                <FormField
                  control={control}
                  name="phone"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <>
                        <div className="space-y-2">
                          <FormLabel>Phone</FormLabel>
                          <PhoneInput2
                            value={value}
                            onChange={(
                              value: string,
                              countryData: CountryData,
                            ) => {
                              let formattedValue = value;
                              const { dialCode } = countryData;

                              if (formattedValue.startsWith(dialCode)) {
                                const phoneNumberWithoutDialCode =
                                  formattedValue.substring(dialCode.length);

                                if (
                                  phoneNumberWithoutDialCode.startsWith('0')
                                ) {
                                  // Remove leading zero
                                  formattedValue =
                                    dialCode +
                                    phoneNumberWithoutDialCode.substring(1);
                                }
                              }
                              onChange(formattedValue);
                            }}
                            message={errors.phone?.message}
                          />
                        </div>
                      </>
                    );
                  }}
                />

                {!data && (
                  <FormField
                    control={control}
                    name="password"
                    render={({
                      field: { onChange, value },
                      formState: { errors },
                    }) => {
                      return (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              onChange={onChange}
                              value={value}
                            />
                          </FormControl>

                          <FormMessage>{errors.password?.message}</FormMessage>
                        </FormItem>
                      );
                    }}
                  />
                )}
                <div className="space-y-2">
                  <FormLabel>Role</FormLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <ReactSelect
                          options={roles}
                          value={roles.find(
                            (option: any) => option.value === value,
                          )} // Find the matching option by value
                          onChange={(val: any) => onChange(val?.value)}
                        />
                      );
                    }}
                  />
                </div>
                <FormField
                  control={control}
                  name="photo"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <div className="flex flex-col space-y-2 justify-between">
                        <FormLabel className="mt-3">Photo</FormLabel>
                        <FileUploader
                          multiple={false}
                          handleChange={onChange}
                          name="file"
                          value={value}
                          types={['jpeg', 'png', 'jpg', 'svg+xml', 'webp']}
                        />
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
                  loading={addingUser || editingUser}
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

export default UserModal;
