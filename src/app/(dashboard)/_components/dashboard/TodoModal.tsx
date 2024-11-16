import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import 'react-datepicker/dist/react-datepicker.css';
import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { todoModalAtom } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

const TodoModal = () => {
  const [todoState, setTodoState] = useAtom(todoModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: addTodoItem,
    isLoading: addingTodo,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/todos`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-todos'] });
        reset();
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
    mutate: editTodoItem,
    isLoading: editingTodo,
    isError: isEditError,
    error: editError,
  } = useApiMutation<any>({
    endpoint: `/todos`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-todos'] });
        reset();
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
    setTodoState({
      ...todoState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    title: '',
    content: '',
    dueDate: new Date(),
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    dueDate: Yup.string().required('Due date is required'),
  });

  const form = useForm<any>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { reset, handleSubmit, control, watch } = form;

  const { data, isLoading: fetchingUser } = useApiGet<any>({
    endpoint: `/todos/${todoState?.data?.id}`,
    queryKey: ['get-todos', todoState?.data?.id],
    config: {
      enabled: !!todoState?.data?.id,
      onSuccess: (data: any) => {
        reset({
          ...data?.data,
          dueDate: new Date(data?.data?.dueDate),
        });
      },
    },
  });
  const date = watch('dueDate');

  const onSubmit = (values: any) => {
    const addPayload = {
      title: values.title,
      content: values.content,
      dueDate: new Date(values?.dueDate)?.toISOString(),
    };
    const editPayload = {
      title: values.title,
      content: values.content,
      dueDate: new Date(values?.dueDate)?.toISOString(),
      todoId: todoState?.data?.id,
    };
    data ? editTodoItem(editPayload) : addTodoItem(addPayload);
  };
  // Function to get the minimum time based on the selected date
  const getMinTime = (date: any) => {
    const now = new Date();
    if (date && date.toDateString() === now.toDateString()) {
      return now;
    } else {
      return new Date().setHours(0, 0, 0, 0); // Return the start of the day as a Date object
    }
  };

  // Function to get the maximum time
  const getMaxTime = () => {
    return new Date().setHours(23, 59, 59, 999); // Return the end of the day as a Date object
  };

  return (
    <>
      <Modal
        className="!overflow-visible"
        open={todoState.status}
        onClose={() => {
          setTodoState({ data: null, status: false });
        }}
        title={data ? 'Edit Todo' : 'New Todo'}
      >
        {fetchingUser ? (
          <Spinner />
        ) : (
          <>
            {(isEditError || isAddError) && <AlertDestructive error={editError || addError} />}
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
                <div className="flex flex-col gap-4">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field: { onChange, value }, formState: { errors } }) => {
                      return (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input onChange={onChange} value={value} />
                          </FormControl>

                          <FormMessage>{errors.title?.message?.toString()}</FormMessage>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={control}
                    name="content"
                    render={({ field: { onChange, value }, formState: { errors } }) => {
                      return (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea rows={4} onChange={onChange} value={value} />
                          </FormControl>

                          <FormMessage>{errors.content?.message?.toString()}</FormMessage>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={control}
                    name="dueDate"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <DatePicker
                            className="border border-gray-300 rounded-sm h-10 px-3 w-full"
                            placeholderText="select due date"
                            selected={value}
                            showTimeSelect={true}
                            minDate={new Date()}
                            minTime={new Date(getMinTime(date))} // Ensure this is a Date object
                            maxTime={new Date(getMaxTime())} // Ensure this is a Date object
                            timeFormat="h:mm aa"
                            timeCaption="time"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            onChange={(date: any) => onChange(date)}
                          />
                          {/* <FormMessage>{errors.content?.message?.toString()}</FormMessage> */}
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant={'outline'} onClick={closeModal}>
                    Cancel
                  </Button>

                  <LoadingButton loading={addingTodo || editingTodo} type="submit" variant="default">
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

export default TodoModal;
