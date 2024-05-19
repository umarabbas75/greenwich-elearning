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
import { Textarea } from '@/components/ui/textarea';
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
      onSuccess: () => {
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
    endpoint: `/quizzes/${userState?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
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
  });
  const { reset, handleSubmit, control, watch } = form;
  const options = watch('options');

  const { data, isLoading: fetchingUser } = useApiGet<any>({
    endpoint: `/quizzes/${userState?.data?.id}`,
    queryKey: ['get-all-quizzes', userState?.data?.id],
    config: {
      enabled: !!userState?.data?.id,
      onSuccess: (data: any) => {
        reset({
          ...data?.data,
          options: data?.data?.options?.map((item: any) => {
            return {
              label: item,
              value: item,
              __isNew__: true,
            };
          }),
          answer: {
            value: data?.data?.answer,
            label: data?.data?.answer,
          },
        });
      },
    },
  });

  const onSubmit = (values: any) => {
    const payload = {
      answer: values.answer?.value,
      options: values?.options?.map((item: any) => item?.value),
      question: values.question,
    };

    data ? editQuiz(payload) : addQuiz(payload);
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
              <div className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="question"
                  render={({ field: { onChange, value }, formState: { errors } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Textarea rows={4} onChange={onChange} value={value} />
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
                            onChange(val);
                          }}
                          className=""
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
