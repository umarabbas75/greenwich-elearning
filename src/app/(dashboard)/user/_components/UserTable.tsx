'use client';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { Eye, Redo } from 'lucide-react';
import { FC } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import {
  assignCoursesModalAtom,
  confirmationModalAtom,
  updatePasswordModalAtom,
  userModalAtom,
  viewUserCoursesModal,
} from '@/store/modals';
import { Icons } from '@/utils/icon';

import { UserData, UsersDataResponse } from '../page';

import AssignCoursesModal from './AssignCoursesModal';
import UpdatePasswordModal from './UpdatePasswordModal';
import UserModal from './UserModal';
import ViewUserCoursesModal from './ViewUserCoursesModal';

const columnHelper = createColumnHelper<UserData>();

interface Props {
  data: UsersDataResponse;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const UserTable: FC<Props> = ({ data, pagination, setPagination, isLoading }) => {
  const [userState, setUserState] = useAtom(userModalAtom);
  const [updatePasswordState, setUpdatePasswordState] = useAtom(updatePasswordModalAtom);
  const [userCoursesState, setUserCoursesState] = useAtom(viewUserCoursesModal);
  const [assignCoursesState, setAssignCoursesState] = useAtom(assignCoursesModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const renderActions = (row: UserData) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setAssignCoursesState({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          {/* <Icons iconName="book" className="w-6 h-6 cursor-pointer" /> */}
          <Redo />
          Assign Courses
        </span>
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
            setUpdatePasswordState({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          <Eye />
          Update Password
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
    columnHelper.accessor('photo', {
      header: 'Photo',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            {props.row.original.photo ? (
              <img
                src={props.row.original.photo}
                alt="user image"
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <Icons iconName="avatar" className="h-12 w-12" />
            )}
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('firstName', {
      header: 'Name',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            <span>{`${props.row.original.firstName} ${props.row.original.lastName}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('email', {
      id: 'email',
      header: 'Email',
      cell: (props) => <h1>{props.row.original.email}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('phone', {
      id: 'phone',
      header: 'Phone',
      cell: (props) => <h1>{props.row.original.phone}</h1>,
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('role', {
      id: 'role',
      header: 'Role',
      cell: (props) => (
        <h1 className="uppercase">{props.row.original.role === 'user' ? 'STUDENT' : 'ADMIN'}</h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('courses', {
      id: 'courses',
      header: 'Courses',
      cell: (props) => (
        <h1
          className="cursor-pointer text-themeBlue whitespace-nowrap"
          onClick={() => {
            setUserCoursesState({
              status: true,
              data: props.row.original,
            });
          }}
        >
          {props.row.original.courses?.length} Course(s)
        </h1>
      ),
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

  const { mutate: deleteUser, isLoading: deletingUser } = useApiMutation({
    method: 'delete',
    endpoint: `/users/${confirmState?.data?.id}`,
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
          queryKey: ['get-users'],
        });
      },
      onError: (data) => {
        toast({
          variant: 'destructive',
          title: 'Error ',
          description: data?.response?.data?.error ?? 'Some error occured',
        });
      },
    },
  });

  return (
    <>
      <img src="" alt="" />
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Users</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {userState.status && <UserModal />}
      {userCoursesState.status && <ViewUserCoursesModal />}
      {updatePasswordState.status && <UpdatePasswordModal />}
      {assignCoursesState.status && <AssignCoursesModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete User'}
          content={`Are you sure you want to delete this user?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteUser(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingUser,
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
