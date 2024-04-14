import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@/components/common/LoadingButton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
const UpdatePassword = ({ isEdit }: { isEdit: boolean }) => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const defaultValues = {
    old_password: '',
    new_password: '',
  };

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required('Old password is required'),
    new_password: Yup.string().required('New password is required'),
    // new_password: Yup.string()
    //   .required('New password is required')
    //   .test('passwords-match', 'Passwords do not match', function (value) {
    //     return this.parent.old_password === value;
    //   }),
  });
  const form = useForm<PasswordChange>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, control } = form;

  // const { mutate, isLoading } = useUpdatePassword({
  //   onSuccess: () => {
  //     form.reset(defaultValues);
  //     toast({
  //       variant: 'success',
  //       title: 'Password Updated',
  //       description: 'Your password has been updated successfully',
  //     });
  //   },
  // });

  const { mutate, isLoading } = useApiMutation<any>({
    endpoint: `/users/changePassword/${session?.user?.id}`,
    method: 'put',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });

        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Your password has been updated successfully',
        });
      },
      onError: (error) => {
        console.log({ error });
        toast({
          variant: 'destructive',
          // title: 'Success ',
          description: error?.response?.data?.error,
        });
      },
      // onError: (data) => {
      //   toast({
      //     variant: 'destructive',
      //     title: 'Error ',
      //     description: data?.response?.data?.type?.[0] ?? 'Some error occured',
      //   });
      // },
    },
  });

  const onSubmit = (values: PasswordChange) => {
    if (session?.user?.id) {
      mutate({ password: values?.new_password, oldPassword: values?.old_password });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="old_password"
            render={({ field: { onChange, value }, formState: { errors } }) => {
              return (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input disabled={!isEdit} type="password" onChange={onChange} value={value} />
                  </FormControl>

                  <FormMessage>{errors.old_password?.message}</FormMessage>
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="new_password"
            render={({ field: { onChange, value }, formState: { errors } }) => {
              return (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input disabled={!isEdit} type="password" onChange={onChange} value={value} />
                  </FormControl>

                  <FormMessage>{errors.new_password?.message}</FormMessage>
                </FormItem>
              );
            }}
          />
        </div>

        {isEdit && (
          <div className="flex items-center justify-start gap-2">
            <LoadingButton loading={isLoading} type="submit" variant="default">
              Submit
            </LoadingButton>
          </div>
        )}
      </form>
    </Form>
  );
};

export default UpdatePassword;
