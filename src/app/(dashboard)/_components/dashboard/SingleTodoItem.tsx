import { useAtom } from 'jotai';
import { Edit3, Trash } from 'lucide-react';
import React from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import Spinner from '@/components/common/Spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { confirmationModalAtom, todoModalAtom } from '@/store/modals';
import { formatDate } from '@/utils/utils';

import TodoModal from './TodoModal';

const SingleTodoItem = ({ selectedTodo, todo, setSelectedTodo }: any) => {
  const [todoState, setTodoState] = useAtom(todoModalAtom);

  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const queryClient = useQueryClient();
  // const [selectedTodoForDelete, setselectedTodoForDelete] = useState(second)
  const { mutate: deleteTodo, isLoading: deletingTodo } = useApiMutation({
    method: 'delete',
    endpoint: `/todos/${confirmState?.data?.id}`,
    config: {
      onSuccess: () => {
        setConfirmState({
          ...confirmState,
          status: false,
          data: null,
        });
        toast({
          variant: 'success',
          title: 'Success ',
          description: 'Data deleted successfully',
        });
        queryClient.invalidateQueries({
          queryKey: ['get-todos'],
        });
      },
    },
  });
  const { mutate: editTodoItem, isLoading: editingTodo } = useApiMutation<any>({
    endpoint: `/todos`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-todos'] });
        setSelectedTodo({});
      },
    },
  });

  const getDueDateDisplay = (dueDate: any) => {
    if (!dueDate) return '';

    const today: any = new Date();
    const dueDateObj: any = new Date(dueDate);

    const diffInDays = Math.floor((dueDateObj - today) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Due Today!';
    } else if (diffInDays > 0) {
      return `Due in ${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
    } else {
      return `Overdue by ${Math.abs(diffInDays)} day${Math.abs(diffInDays) > 1 ? 's' : ''}`;
    }
  };

  return (
    <div
      key={todo.id}
      className="flex relative justify-between items-center mb-2 px-2 py-1 bg-white rounded-md"
    >
      <div className="flex items-center">
        <Checkbox
          className="mr-2"
          onCheckedChange={(value) => {
            const payload = {
              todoId: todo?.id,
              isCompleted: value,
            };
            editTodoItem(payload);
          }}
        />
        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <p
                className={`text-base text-primary underline cursor-pointer ${
                  todo.isCompleted && 'line-through text-gray-500'
                }`}
              >
                {todo.title}
              </p>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">{todo.title}</h4>
                  <p className="text-sm text-muted-foreground">{todo.content}</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <p className="text-sm text-gray-500">
            <span className="mr-1">Created:</span>

            {formatDate(todo.createdAt)}
          </p>
          {todo.dueDate && (
            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
              <span
                className={`${
                  getDueDateDisplay(todo.dueDate).includes('Overdue')
                    ? 'text-red-500 font-bold'
                    : getDueDateDisplay(todo.dueDate).includes('Due Today')
                    ? 'text-green-800 font-bold'
                    : ''
                }`}
              >
                {getDueDateDisplay(todo.dueDate)}
              </span>
              <span className="ml-1">which is {formatDate(todo?.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex">
        <div
          onClick={() => {
            // if (!selectedTodo?.id) {
            //   setSelectedTodo(todo);
            // } else {
            //   setSelectedTodo({});
            // }
            setTodoState({
              data: todo,
              status: true,
            });
          }}
          className={`p-2 hover:bg-gray-200 cursor-pointer rounded-full transition duration-300 ${
            selectedTodo?.id && 'bg-gray-200'
          }`}
        >
          <Edit3 className="w-4 h-4 text-gray-500" />
        </div>
        <div
          onClick={() => {
            setConfirmState({
              data: todo,
              status: true,
            });
          }}
          className="p-2 hover:bg-gray-200 cursor-pointer rounded-full transition duration-300"
        >
          <Trash className="w-4 h-4 text-red-500" />
        </div>
      </div>

      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Todo'}
          content={`Are you sure you want to delete this todo?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteTodo(confirmState.data.id);
            },
            loading: deletingTodo,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => setConfirmState({ status: false, data: null }),
          }}
        />
      )}
      {editingTodo && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/10">
          <div className="w-full flex justify-center items-center">
            <Spinner />
          </div>
        </div>
      )}

      {todoState?.status && <TodoModal />}
    </div>
  );
};

export default SingleTodoItem;
