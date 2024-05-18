import { useAtom } from 'jotai';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApiGet } from '@/lib/dashboard/client/user';
import { todoModalAtom } from '@/store/modals';

import PaginationComp from './Pagination';
import SingleTodoItem from './SingleTodoItem';
import TodoModal from './TodoModal';

function TodoList() {
  const [selectedTodo, setSelectedTodo] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [todoState, setTodoState] = useAtom(todoModalAtom);
  const [todosList, setTodosList] = useState<any>(null);
  const [filteredTodos, setFilteredTodos] = useState<any>(null); // State to hold filtered todos
  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('all'); // State to hold the selected filter option
  const pageSize = 5; // Number of records per page

  const { data: apiData, isLoading: loadingTodos } = useApiGet<any, Error>({
    endpoint: `/todos`,
    queryKey: ['get-todos'],
    config: {
      select: (res) => res?.data?.data,
    },
  });

  useEffect(() => {
    if (apiData) {
      setTodosList(apiData);
      setFilteredTodos(apiData.todos); // Initialize filtered todos with all todos on component mount
    }
  }, [apiData]);

  const totalPages = Math.ceil((filteredTodos?.length || 0) / pageSize);

  // Function to filter todos based on search input value
  const handleTodoListSearch = (value: string, option: any) => {
    setSearch(value);
    let filtered = todosList.todos.filter((item: any) => {
      return item.title.toLowerCase().includes(value.toLowerCase());
    });
    filtered = filtered.filter((todo: any) => {
      if (option === 'completed') {
        return todo.isCompleted;
      } else if (option === 'incomplete') {
        return !todo.isCompleted;
      } else if (option === 'due') {
        const now = new Date();
        return new Date(todo.dueDate) > now;
      } else {
        return todo;
      }
    });
    setFilteredTodos(filtered);
    setCurrentPage(0);
  };

  const onFilterOptionChange = (option: any, search: any) => {
    setFilterOption(option);

    let filtered = todosList.todos.filter((todo: any) => {
      if (option === 'completed') {
        return todo.isCompleted;
      } else if (option === 'incomplete') {
        return !todo.isCompleted;
      } else if (option === 'due') {
        const now = new Date();
        return new Date(todo.dueDate) > now;
      } else {
        return todo;
      }
    });
    filtered = filtered?.filter((item: any) => {
      return item.title.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredTodos([...filtered]);
    setCurrentPage(0);
  };

  // Function to filter todos based on dropdown option
  // const handleFilterChange = (option: string) => {
  //   setStatusFilter(option);
  //   console.log({ filteredTodos, option });
  //   filterTodos('', option);
  //   const updatedList = todosList?.todos?.filter((item: any) => {
  //     if (option === 'completed') {
  //       return item?.isCompleted === true;
  //     }
  //     if (option === 'incomplete') {
  //       return item?.isCompleted === false;
  //     }
  //     if (option === 'due') {
  //       return new Date(item?.dueDate) > new Date() && item?.isCompleted === false;
  //     } else {
  //       return item;
  //     }
  //   });
  //   setFilteredTodos([...updatedList]);
  //   setCurrentPage(0);
  // };

  // Function to filter todos based on search value and filter option
  // const filterTodos = (searchValue: string, option: string) => {
  //   let filtered = todosList.todos.filter((item: any) => {
  //     return item.title.toLowerCase().includes(searchValue.toLowerCase());
  //   });

  //   if (option === 'completed') {
  //     filtered = filtered.filter((todo: any) => todo.completed);
  //   } else if (option === 'incomplete') {
  //     filtered = filtered.filter((todo: any) => !todo.completed);
  //   } else if (option === 'due') {
  //     const now = new Date();
  //     filtered = filtered.filter((todo: any) => new Date(todo.dueDate) < now);
  //   }

  //   setFilteredTodos(filtered);
  //   setCurrentPage(0); // Reset currentPage when search filter changes
  // };

  if (loadingTodos) {
    return 'loading...';
  }

  return (
    <div className="bg-white flex flex-col  rounded-xl  shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4  text-primary">Todo List</h2>

      <div className="flex justify-between mb-4">
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
        <div className="flex items-center">
          <Input
            value={search}
            placeholder="search todo item"
            onChange={(e) => {
              handleTodoListSearch(e.target.value, filterOption);
            }}
          />
          <select
            className="ml-4 p-2 border rounded"
            value={filterOption}
            onChange={(e) => onFilterOptionChange(e.target.value, search)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="due">Due</option>
          </select>
        </div>
      </div>
      <div className="w-full  bg-gray-100 rounded-lg p-5">
        {filteredTodos?.length > 0 ? (
          <>
            {filteredTodos
              ?.slice(currentPage * pageSize, currentPage * pageSize + pageSize)
              .map((todo: any) => (
                <SingleTodoItem
                  key={todo.id}
                  todo={todo}
                  setSelectedTodo={setSelectedTodo}
                  selectedTodo={selectedTodo}
                />
              ))}
            <div className="flex-1 flex justify-end relative text-left">
              <PaginationComp
                onPaginationClick={(index) => {
                  setCurrentPage(index);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          </>
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
