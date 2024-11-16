import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CountryData } from 'react-phone-input-2';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import PhoneInput2 from '@/components/common/PhoneInput2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import axiosAuth from '@/utils/axiosAuth';

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}
const passwordRequirements =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*,;.:?/\\])[a-zA-Z0-9!@#$%^&*,;.:?/\\]{8,}$/;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('phone is required'),
  password: Yup.string()
    .required('Password is required.')
    .matches(
      passwordRequirements,
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required.'),
});

const SignUpForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const courseId = params.get('courseId');
  const userId = params.get('userId');

  const form = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const queryClient = useQueryClient();

  const {
    mutate: assignCourse,
    isLoading: assigningCourse,
    isError: isAssignError,
    error: assignError,
  } = useApiMutation<any>({
    endpoint: `/courses/assignCourse/public`,
    method: 'put',
    sendDataInParams: true,
    config: {
      onSuccess: async (_: any, variables: any) => {
        reset({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'user',
        });

        try {
          // Perform a fresh fetch request directly
          const response = await axiosAuth.get(`users/${variables?.userId}`);

          if (response?.data?.data?.id) {
            router.replace(`/payment?courseId=${courseId}&userId=${response?.data?.data?.id}`);
          }

          // Handle the fetched data as needed (e.g., setting it in local state)
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Registration success!',
        });
      },
    },
  });

  const {
    mutate: addUser,
    isLoading: addingUser,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/users`,
    method: 'post',
    config: {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ['get-users'] });

        const payload = {
          userId: res?.data?.data?.id,
          courseId: courseId,
        };
        assignCourse(payload);
      },
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    const addPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      role: values.role,
      email: values?.email,
      password: values?.password,
    };
    addUser(addPayload);

    // Handle form submission logic here
  };

  useEffect(() => {
    if (userId && courseId && router) {
      router.replace(`/payment?courseId=${courseId}&userId=${userId}`);
    }
  }, [userId, courseId]);

  return (
    <div className="mt-10 bg-white p-6 mr-4 rounded-sm">
      {(isAddError || isAssignError) && <AlertDestructive error={addError || assignError} />}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-8">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter name" />
                </FormControl>
                {errors.firstName && <FormMessage>{errors?.firstName?.message?.toString()}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter last name" />
                </FormControl>
                {errors.lastName && <FormMessage>{errors?.lastName?.message?.toString()}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter email" />
                </FormControl>
                {errors.email && <FormMessage>{errors?.email?.message?.toString()}</FormMessage>}
              </FormItem>
            )}
          />
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
                          const phoneNumberWithoutDialCode = formattedValue.substring(dialCode.length);

                          if (phoneNumberWithoutDialCode.startsWith('0')) {
                            // Remove leading zero
                            formattedValue = dialCode + phoneNumberWithoutDialCode.substring(1);
                          }
                        }
                        onChange(formattedValue);
                      }}
                      message={errors.phone?.message?.toString()}
                    />
                  </div>
                </>
              );
            }}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter password" />
                </FormControl>
                {errors.password && <FormMessage>{errors?.password?.message?.toString()}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter confirm password" />
                </FormControl>
                {errors.confirmPassword && (
                  <FormMessage>{errors?.confirmPassword?.message?.toString()}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="sm:col-span-2 flex justify-end mt-6">
            <LoadingButton loading={addingUser || assigningCourse} type="submit" variant="default">
              Sign up
            </LoadingButton>
          </div>
        </form>
      </Form>

      {/* {userId && paymentModalState?.status && <PaymentModal />} */}
    </div>
  );
};

export default SignUpForm;
