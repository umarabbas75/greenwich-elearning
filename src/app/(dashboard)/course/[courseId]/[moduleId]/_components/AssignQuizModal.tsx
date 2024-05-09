import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import ReactSelect from '@/components/common/ReactSelect';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormLabel } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { assignQuizzesModalAtom } from '@/store/modals';

/* const MAX_FILE_SIZE = 102400; */
type UserFormTypes = {
  quizzes?: string[] | undefined;
};

const AssignQuizModal = () => {
  const [assignQuizesState, setAssignQuizesState] = useAtom(assignQuizzesModalAtom);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: assignQuiz,
    isLoading: assigningQuiz,
    isError: isAssignError,
    error: assignError,
  } = useApiMutation<any>({
    endpoint: `/quizzes/assignQuiz`,
    method: 'put',
    sendDataInParams: true,
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-users'] });
        closeModal();
        queryClient.invalidateQueries(['get-chapters']);

        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record added successfully',
        });
      },
    },
  });

  const closeModal = () => {
    setAssignQuizesState({
      ...assignQuizesState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    quizzes: [],
  };
  const validationSchema = Yup.object().shape({
    quizzes: Yup.object().required('quizzes is required'),
  });

  const form = useForm<UserFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control } = form;

  const { data: quizzesData, isLoading } = useApiGet<any, Error>({
    endpoint: `/quizzes`,
    queryKey: ['get-quizzes'],
  });

  const { data: assignedQuizzes, isLoading: loadingAssignedQuizzes } = useApiGet<any>({
    endpoint: `/quizzes/getAllAssignQuizzes/${assignQuizesState?.data?.id}`,
    queryKey: ['get-all-assigned-quizzes', assignQuizesState?.data?.id],
    config: {
      enabled: !!assignQuizesState?.data?.id,
      select: (res) => res?.data?.data,
    },
  });
  console.log({ assignedQuizzes });
  const onSubmit = (values: UserFormTypes) => {
    const payload = {
      quizId: (values.quizzes as any).value,
      chapterId: assignQuizesState?.data?.id,
    };
    assignQuiz(payload);
  };

  return (
    <Modal open={assignQuizesState.status} onClose={() => {}} title={'Assign Quizzes'}>
      {isLoading || loadingAssignedQuizzes ? (
        <Spinner />
      ) : (
        <>
          {isAssignError && <AlertDestructive error={assignError} />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <FormLabel>Quizzes</FormLabel>
                {quizzesData && (
                  <Controller
                    name="quizzes"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <ReactSelect
                          isMulti={false}
                          options={
                            quizzesData.data.map((item: any) => {
                              return {
                                label: item.question,
                                value: item.id,
                              };
                            }) ?? []
                          }
                          value={value} // Find the matching option by value
                          onChange={(val: any) => {
                            onChange(val);
                          }}
                          isOptionDisabled={(option: any) => {
                            const isDisable = assignedQuizzes?.some(
                              (disabledItem: any) => disabledItem.id === option.value,
                            );
                            return isDisable;
                          }}
                          className=""
                        />
                      );
                    }}
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton loading={assigningQuiz} type="submit" variant="default">
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

export default AssignQuizModal;
