import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@/components/common/LoadingButton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
const UpdateNameForm = ({ isEdit }: { isEdit: boolean }) => {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const defaultValues = {
    firstName: session?.user?.firstName ?? '',
    lastName: session?.user?.lastName ?? '',
  };

  useEffect(() => {
    form.reset({
      firstName: session?.user?.firstName ?? '',
      lastName: session?.user?.lastName ?? '',
    });
  }, [session]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('firstName is required'),
    lastName: Yup.string().required('lastName is required'),
  });
  const form = useForm<UserName>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, control } = form;
  const onSubmit = async (values: UserName) => {
    setLoading(true);
    await update({
      firstName: values.firstName,
      lastName: values.lastName,
    });
    setLoading(false);
    toast({
      variant: 'success',
      title: 'Name Updated',
    });
    // setTimeout(() => {

    // }, 300);
  };

  return (
    <div className="grid grid-cols-3  items-center py-4 border-b ">
      <div className="col-span-1">
        <h3 className="text-xl font-bold">Name</h3>
        <p className="text-accent">Update your name</p>
      </div>
      <div className="col-span-2 flex items-center gap-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="firstName"
                render={({ field: { onChange, value }, formState: { errors } }) => {
                  return (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input disabled={!isEdit} onChange={onChange} value={value} />
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
                        <Input disabled={!isEdit} onChange={onChange} value={value} />
                      </FormControl>

                      <FormMessage>{errors.lastName?.message}</FormMessage>
                    </FormItem>
                  );
                }}
              />
            </div>

            {isEdit && (
              <div className="flex items-center justify-start gap-2">
                <LoadingButton loading={loading} type="submit" variant="default">
                  Submit
                </LoadingButton>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateNameForm;
