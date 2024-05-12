import { useAtom } from 'jotai';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { todoModalAtom } from '@/store/modals';

import SingleTodoItem from './SingleTodoItem';
import TodoModal from './TodoModal';

function TodoList() {
  const [selectedTodo, setSelectedTodo] = useState<any>({});
  const [todoState, setTodoState] = useAtom(todoModalAtom);

  const { data: todosList, isLoading: loadingTodos } = useApiGet<any, Error>({
    endpoint: `/todos`,
    queryKey: ['get-todos'],
    config: {
      select: (res) => res?.data?.data,
    },
  });

  if (loadingTodos) {
    return 'loading...';
  }

  return (
    <div className="bg-white flex flex-col  rounded-xl  shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4  text-primary">Todo List</h2>

      <div className="flex justify-between mb-4">
        {/* <div className="flex-[2] flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Add todo item"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
          </div>
          <LoadingButton
            loading={addingTodo || editingTodo}
            onClick={() => {
              const payload = {
                content: inputValue,
              };

              selectedTodo?.id
                ? editTodoItem({ ...payload, todoId: selectedTodo?.id })
                : addTodoItem(payload);
            }}
          >
            {selectedTodo?.id ? 'Edit Task' : 'Add Task'}
          </LoadingButton>
        </div> */}
        <div>
          <Button
            onClick={() =>
              setTodoState({
                data: null,
                status: true,
              })
            }
          >
            Add Todo
          </Button>
        </div>

        <div className="flex-1 flex justify-end relative text-left">
          <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="inprogress">In Progress</option>
          </select>
        </div>
      </div>
      <div className="w-full  bg-gray-100 rounded-lg p-5">
        {todosList?.length > 0 ? (
          todosList?.map((todo: any) => (
            <SingleTodoItem
              key={todo.id}
              todo={todo}
              setSelectedTodo={setSelectedTodo}
              selectedTodo={selectedTodo}
              // editTodoItem={editTodoItem}
            />
          ))
        ) : (
          <div className="bg-gray-100 border border-gray-200 p-4 rounded-md shadow-md text-center">
            <p className="text-lg text-gray-700">Nothing on your todo list.</p>
          </div>
        )}
      </div>
      {todoState?.status && <TodoModal />}
    </div>
  );
}

export default TodoList;
