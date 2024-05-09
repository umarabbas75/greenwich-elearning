import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { Trash } from 'lucide-react';
import { FileUploader } from 'react-drag-drop-files';
import { Controller, useForm } from 'react-hook-form';
import { CountryData } from 'react-phone-input-2';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import PhoneInput2 from '@/components/common/PhoneInput2';
import ReactSelect from '@/components/common/ReactSelect';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { userModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

type UserFormTypes = {
  email?: string | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
  role: string;
  photo: null | undefined | string;
  firstName: string;
  lastName: string;
  phone: string;
};

const UserModal = () => {
  const [userState, setUserState] = useAtom(userModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: addUser,
    isLoading: addingUser,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/users`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-users'] });
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
    mutate: editUser,
    isLoading: editingUser,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/users/${userState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-users'] });
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
    setUserState({
      ...userState,
      status: false,
      data: null,
    });
  };
  const roles = [
    {
      label: 'Student',
      value: 'user',
    },
    {
      label: 'Admin',
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
  const passwordRequirements =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*,;.:?/\\])[a-zA-Z0-9!@#$%^&*,;.:?/\\]{8,}$/;
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('first name is required'),
    lastName: Yup.string().required('last name is required'),

    email: Yup.string().email('Invalid email').required('phone is required'),
    phone: Yup.string().required('phone is required'),

    password: Yup.string().when('uid', {
      is: () => !!userState?.data?.id,
      then: () => Yup.string().notRequired(),
      otherwise: () =>
        Yup.string()
          .required('Password is required.')
          .matches(
            passwordRequirements,
            'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
          ),
    }),
    confirmPassword: Yup.string().when('uid', {
      is: () => !!userState?.data?.id,
      then: () => Yup.string().notRequired(),
      otherwise: () =>
        Yup.string()
          .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
          .required('Confirm password is required.'),
    }),

    // confirmPassword: Yup.string().when('uid', {
    //   is: () => !!userState?.data?.id,
    //   then: Yup.string()
    //     .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    //     .required('Confirm password is required'),
    //   otherwise: Yup.string().notRequired(),
    // }),
    role: Yup.string().required('role is required'),
    photo: Yup.string().notRequired(),
  });

  const form = useForm<UserFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { reset, handleSubmit, control } = form;

  // const { data, isLoading: fetchingUser } = useFetchUser({
  //   variables: {
  //     id: userState?.data?.id,
  //   },
  //   onSuccessCallback: (data: any) => {
  //     form.reset({
  //       ...data,
  //       customer: data?.customer,
  //     });
  //   },
  // });

  const { data, isLoading: fetchingUser } = useApiGet<any>({
    endpoint: `/users/${userState?.data?.id}`,
    queryKey: ['get-user', userState?.data?.id],
    config: {
      enabled: !!userState?.data?.id,
      onSuccess: (data: any) => {
        reset({
          ...data?.data,
        });
      },
    },
  });

  const onSubmit = (values: UserFormTypes) => {
    const editPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      role: values.role,
      photo: values?.photo,
    };
    const addPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      role: values.role,
      photo: values?.photo,
      email: values?.email,
      password: values?.password,
    };
    data ? editUser(editPayload) : addUser(addPayload);
  };

  return (
    <>
      <Modal
        open={userState.status}
        onClose={() => {
          setUserState({ data: null, status: false });
        }}
        title={data ? 'Edit User' : 'New User'}
      >
        {fetchingUser ? (
          <Spinner />
        ) : (
          <>
            {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value }, formState: { errors } }) => {
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
                    render={({ field: { onChange, value }, formState: { errors } }) => {
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
                      render={({ field: { onChange, value }, formState: { errors } }) => {
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
                    render={({ field: { onChange, value }, formState: { errors } }) => {
                      return (
                        <>
                          <div className="space-y-2">
                            <FormLabel>Phone</FormLabel>
                            <PhoneInput2
                              value={value}
                              onChange={(value: string, countryData: CountryData) => {
                                let formattedValue = value;
                                const { dialCode } = countryData;

                                if (formattedValue.startsWith(dialCode)) {
                                  const phoneNumberWithoutDialCode = formattedValue.substring(
                                    dialCode.length,
                                  );

                                  if (phoneNumberWithoutDialCode.startsWith('0')) {
                                    // Remove leading zero
                                    formattedValue = dialCode + phoneNumberWithoutDialCode.substring(1);
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
                    <>
                      <FormField
                        control={control}
                        name="password"
                        render={({ field: { onChange, value }, formState: { errors } }) => {
                          return (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" onChange={onChange} value={value} />
                              </FormControl>

                              <FormMessage>{errors.password?.message}</FormMessage>
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value }, formState: { errors } }) => {
                          return (
                            <FormItem>
                              <FormLabel>Confirm password</FormLabel>
                              <FormControl>
                                <Input type="password" onChange={onChange} value={value} />
                              </FormControl>

                              <FormMessage>{errors.confirmPassword?.message}</FormMessage>
                            </FormItem>
                          );
                        }}
                      />
                    </>
                  )}
                  <div className="space-y-2">
                    <FormLabel>Role</FormLabel>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <ReactSelect
                            isMulti={false}
                            options={roles}
                            value={roles.find((option: any) => option.value === value)} // Find the matching option by value
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
                            classes="upload-doc !w-full !min-w-full"
                            maxSize={1}
                            multiple={false}
                            handleChange={(value: any) => {
                              const file = value;
                              const reader = new FileReader();
                              reader.onload = (e: any) => {
                                const base64 = e.target.result;
                                onChange(base64);
                              };

                              reader.readAsDataURL(file);
                            }}
                            name="file"
                            value={value}
                            // disabled={true}
                            types={['jpeg', 'png', 'jpg', 'svg+xml', 'webp']}
                          />
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

                <div className="flex items-center justify-end gap-2">
                  <Button variant={'outline'} onClick={closeModal}>
                    Cancel
                  </Button>

                  <LoadingButton loading={addingUser || editingUser} type="submit" variant="default">
                    Submit
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserModal;
