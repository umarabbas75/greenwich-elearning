'use client';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { confirmationModalAtom, userModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import { UserData } from '../page';

import UserModal from './QuizModal';

const columnHelper = createColumnHelper<any>();

// interface Props {
//   data: UsersDataResponse;
//   pagination: Pagination;
//   setPagination: any;
//   isLoading: boolean;
// }
const UserTable: FC<any> = ({ data, pagination, setPagination, isLoading }) => {
  const [userState, setUserState] = useAtom(userModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: any) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setUserState({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          <Icons iconName="edit" className="w-6 h-6 cursor-pointer" />
          Edit
        </span>

        <span
          onClick={() => {
            setConfirmState({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          <Icons iconName="delete" className="w-6 h-6 cursor-pointer " />
          Delete
        </span>
      </div>
    );
  };

  const columns = [
    // Accessor Columns

    columnHelper.accessor('question', {
      header: 'Question',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            <span>{`${props.row.original.question}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('options', {
      id: 'options',
      header: 'Options',
      cell: (props) => (
        <h1 className="flex">
          {props.row.original.options?.map((item: any) => {
            return (
              <span key={item} className="inline-block p-2 border rounded-sm mx-1">
                {item}
              </span>
            );
          })}
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('answer', {
      id: 'answer',
      header: 'Answer',
      cell: (props) => <h1>{props.row.original.answer}</h1>,
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<UserData, string>) => (
        <TableActions>{renderActions(props.row.original)}</TableActions>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data,
    columns,
    pageCount: Math.ceil(data?.data.length / 10),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteQuiz, isLoading: deletingQuiz } = useApiMutation({
    method: 'delete',
    endpoint: `/quizzes/${confirmState?.data?.id}`,
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
          queryKey: ['get-quizzes'],
        });
      },
      onError: (data: any) => {
        toast({
          variant: 'destructive',
          title: 'Error ',
          description: data?.response?.data?.error ?? 'Some error occurred',
        });
      },
    },
  });

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Quizzes</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {userState.status && <UserModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete User'}
          content={`Are you sure you want to delete this quiz?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteQuiz(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingQuiz,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => setConfirmState({ status: false, data: null }),
          }}
        />
      )}
    </>
  );
};

export default UserTable;
