import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { updatePasswordModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

type UserFormTypes = {
  password?: string;
  confirmPassword?: string;
};

const UpdatePasswordModal = () => {
  const [updatePasswordState, setUpdatePasswordState] = useAtom(updatePasswordModalAtom);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editPassword,
    isLoading: editingPassword,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/users/${updatePasswordState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-users'] });
        closeModal();
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Password updated successfully',
        });
      },
    },
  });
  const closeModal = () => {
    setUpdatePasswordState({
      ...updatePasswordState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };
  const passwordRequirements =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*,;.:?/\\])[a-zA-Z0-9!@#$%^&*,;.:?/\\]{8,}$/;
  const validationSchema = Yup.object().shape({
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

  const form = useForm<any>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (values: UserFormTypes) => {
    const payload = {
      password: values?.password,
    };
    editPassword(payload);
  };

  return (
    <Modal open={updatePasswordState.status} onClose={() => {}} title={'Update password'}>
      <>
        {isEditError && <AlertDestructive error={editError} />}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <>
                <FormField
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => {
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
                  render={({ field: { onChange, value } }) => {
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
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant={'outline'} onClick={closeModal}>
                Cancel
              </Button>

              <LoadingButton loading={editingPassword} type="submit" variant="default">
                Submit
              </LoadingButton>
            </div>
          </form>
        </Form>
      </>
    </Modal>
  );
};

export default UpdatePasswordModal;
