import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { FileUploader } from 'react-drag-drop-files';
import { Controller, useForm } from 'react-hook-form';
import { CountryData } from 'react-phone-input-2';
import * as Yup from 'yup';

import AddressSearchField from '@/components/common/AddressSearchField';
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
import { useFetchCustomerList } from '@/lib/dashboard/client/customer';
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
  first_name: string;
  last_name: string;
  phone: string;
  location: object | null | undefined;
  customer: object | null | undefined;
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
      label: 'admin',
      value: 'admin',
    },
    {
      label: 'student',
      value: 'student',
    },
  ];

  const defaultValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: null,
    customer: null,
    password: '',
    role: '',
    photo: null,
  };
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('first name is required'),
    last_name: Yup.string().required('last name is required'),

    email: Yup.string()
      .email('Invalid email')
      .when('uid', {
        is: () => !!userState?.data?.id,
        then: () => Yup.string().notRequired(),
        otherwise: () =>
          Yup.string()
            .email('invalid email address')
            .required('email is required'),
      }),
    phone: Yup.string().required('phone is required'),
    location: Yup.mixed().required('Address is required'),
    customer: Yup.object().required('customer is required').nullable(),
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
  const { handleSubmit, control, watch } = form;

  const customerValue = watch('role');

  const { data: customerListData, isLoading: customreListLoading } =
    useFetchCustomerList({
      enabled: customerValue === 'student' ? true : false,
    });

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
    {
      values.role === 'student' &&
        addFormData.append('customer', (values.customer as any).id);
    }
    addFormData.append('first_name', values.first_name);
    addFormData.append('last_name', values.last_name);
    addFormData.append('phone', values.phone);
    addFormData.append('location', JSON.stringify(values.location) as any);

    const editFormData = new FormData();
    editFormData.append('role', values.role);
    editFormData.append('first_name', values.first_name);
    editFormData.append('last_name', values.last_name);
    editFormData.append('phone', values.phone);
    editFormData.append('location', JSON.stringify(values.location) as any);
    values.photo &&
      !(typeof values.photo === 'string' && values.photo?.includes('http')) &&
      editFormData.append('photo', values.photo as any);
    {
      values.role === 'student' &&
        editFormData.append('customer', (values.customer as any).id);
    }

    console.log('userState', userState?.data?.id);
    data
      ? editUser({ formData: editFormData, id: userState?.data?.id })
      : addUser(addFormData);
  };

  const renderCustomerField = () => {
    if (customerValue !== 'student') return;
    if (customreListLoading) return <Spinner />;
    return (
      <div className="space-y-2">
        <FormLabel>Company</FormLabel>
        <Controller
          name="customer"
          control={control}
          render={({ field: { onChange, value }, formState: { errors } }) => {
            console.log('customerval', value);
            return (
              <>
                <ReactSelect
                  options={customerListData?.results ?? []}
                  value={value}
                  onChange={(val) => onChange(val)}
                  getOptionLabel={(option: any) => option.company} // Use 'type' as label
                  getOptionValue={(option: any) => option.id} // Use 'value' as value
                />
                <FormMessage>{errors.customer?.message}</FormMessage>
              </>
            );
          }}
        />
      </div>
    );
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
                  name="first_name"
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

                        <FormMessage>{errors.first_name?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name="last_name"
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

                        <FormMessage>{errors.last_name?.message}</FormMessage>
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

                <FormField
                  control={control}
                  name="location"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <div className="flex flex-col space-y-2">
                        <FormLabel className="mt-2">Address</FormLabel>
                        <AddressSearchField value={value} onChange={onChange} />
                        <FormMessage>{errors.location?.message}</FormMessage>
                      </div>
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
                {renderCustomerField()}
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

                        {/* {(typeof value === 'string' || value instanceof File) && (
                        <div className="flex justify-between mt-1 p-2 hover:bg-gray-200 cursor-pointer">
                          {value instanceof File && <span> {value.name}</span>}
                          {typeof value === 'string' && (
                            <span>{getFileName(value)}</span>
                          )}

                          <DeleteIcon
                            className="cursor-pointer"
                            onClick={() => onChange({})}
                          />
                        </div>
                      )} */}
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
