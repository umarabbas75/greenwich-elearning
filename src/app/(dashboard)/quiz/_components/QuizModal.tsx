import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import ReactSelect from '@/components/common/ReactSelect';
import ReactSelectCreateable from '@/components/common/ReactSelectCreateable';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { userModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

type QuizFormTypes = {
  question?: string | undefined;
  options?: string[] | undefined;
  answer: string;
};

const UserModal = () => {
  const [userState, setUserState] = useAtom(userModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: addQuiz,
    isLoading: addingQuiz,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/quizzes`,
    method: 'post',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });

        queryClient.invalidateQueries({ queryKey: ['get-quizzes'] });
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
    mutate: editQuiz,
    isLoading: editingQuiz,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/users/${userState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });

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

  const defaultValues = {
    question: '',
    answer: '',
    options: [],
  };
  // const validationSchema = Yup.object().shape({
  //   question: Yup.string().required('question is required'),
  //   options: Yup.array().of(Yup.string().required('options is required')),

  //   answer: Yup.string().required('answer is required'),
  // });

  const form = useForm<QuizFormTypes>({
    defaultValues,
    //resolver: yupResolver(validationSchema) as any,
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = form;
  console.log({ errors });
  const options = watch('options');
  console.log({ options });
  // const { data, isLoading: fetchingUser } = useFetchUser({
  //   variables: {
  //     id: userState?.data?.id,
  //   },
  //   onSuccessCallback: (data: any) => {
  //     console.log('dataaa', data);
  //     form.reset({
  //       ...data,
  //       customer: data?.customer,
  //     });
  //   },
  // });

  const { data, isLoading: fetchingUser } = useApiGet<any>({
    endpoint: `/quizzes/${userState?.data?.id}`,
    queryKey: ['get-user', userState?.data?.id],
    config: {
      enabled: !!userState?.data?.id,
      onSuccess: (data: any) => {
        console.log({ data });
        reset({
          ...data?.data,
        });
      },
    },
  });

  const onSubmit = (values: any) => {
    console.log('values', values);
    const payload = {
      answer: values.answer?.value,
      options: values?.options?.map((item: any) => item?.value),
      question: values.question,
    };

    data ? editQuiz(payload) : addQuiz(payload);
    // const addFormData = new FormData();
    // addFormData.append('email', values.email as string);
    // addFormData.append('password', values.password as string);
    // addFormData.append('role', values.role);
    // values.photo &&
    //   !(typeof values.photo === 'string' && values.photo?.includes('http')) &&
    //   addFormData.append('photo', values.photo as any);

    // addFormData.append('firstName', values.firstName);
    // addFormData.append('lastName', values.lastName);
    // addFormData.append('phone', values.phone);

    // const editFormData = new FormData();
    // editFormData.append('role', values.role);
    // editFormData.append('firstName', values.firstName);
    // editFormData.append('lastName', values.lastName);
    // editFormData.append('phone', values.phone);
    // values.photo &&
    //   !(typeof values.photo === 'string' && values.photo?.includes('http')) &&
    //   editFormData.append('photo', values.photo as any);
    // const payload = {
    //   firstName: values.firstName,
    //   lastName: values.lastName,
    //   phone: values.phone,
    //   role: values.role,
    // };
    // data ? editUser(payload) : addUser(addFormData);
  };

  return (
    <Modal open={userState.status} onClose={() => {}} title={data ? 'Edit Quiz' : 'New Quiz'}>
      {fetchingUser ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="question"
                  render={({ field: { onChange, value }, formState: { errors } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.question?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <div className="space-y-2">
                  <FormLabel>Options</FormLabel>
                  <Controller
                    name="options"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <ReactSelectCreateable
                          isMulti={true}
                          options={[]}
                          value={value} // Find the matching option by value
                          onChange={(val: any) => {
                            console.log({ val });
                            onChange(val);
                          }}
                          // getOptionLabel={(val: Course) => val.title}
                          // getOptionValue={(val: Course) => val.id}
                        />
                      );
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>Answer</FormLabel>
                  <Controller
                    name="answer"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <ReactSelect
                          isMulti={false}
                          options={options as any}
                          value={value} // Find the matching option by value
                          onChange={(val: any) => {
                            console.log({ val });
                            onChange(val);
                          }}
                          // getOptionLabel={(val: Course) => val.title}
                          // getOptionValue={(val: Course) => val.id}
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton loading={addingQuiz || editingQuiz} type="submit" variant="default">
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
