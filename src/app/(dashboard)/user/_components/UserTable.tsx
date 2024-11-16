'use client';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { Eye, Redo } from 'lucide-react';
import { FC } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { FaUserAltSlash } from 'react-icons/fa';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import NameInitials from '@/components/NameInitials';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import {
  assignCoursesModalAtom,
  confirmationModalAtom,
  updateConfirmationUpdateStatusModalAtom,
  updatePasswordModalAtom,
  userModalAtom,
  viewUserCoursesModal,
} from '@/store/modals';
import { Icons } from '@/utils/icon';
import { getInitials } from '@/utils/utils';

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
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useAtom(updateConfirmationUpdateStatusModalAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: updateUserStatus, isLoading: updatingStatus } = useApiMutation<any>({
    endpoint: `/users/${confirmStatusUpdate?.data?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        setConfirmStatusUpdate({ status: false, data: null });
        queryClient.invalidateQueries({ queryKey: ['get-users'] });
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Status updated successfully',
        });
      },
    },
  });

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

        <span
          className="dark-icon text-accent flex gap-4  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover items-center"
          onClick={(e) => {
            const { id } = row || {};
            setConfirmStatusUpdate({
              status: true,
              data: { id, status: row?.status === 'active' ? 'inactive' : 'active' },
            });
            e.stopPropagation();
          }}
        >
          {row?.status === 'active' ? <FaUserAltSlash /> : <FaUserAlt />}

          {row.status === 'active' ? 'Inactive' : 'Active'}
        </span>
      </div>
    );
  };

  const renderStatus = (status: any) => {
    if (status === 'active') {
      return <div className="bg-[#05eb7412] text-green-600 py-3 px-4 rounded-[40px] w-fit">Active</div>;
    }
    if (status === 'inactive') {
      return <div className="bg-[#0000000d] text-red-600 py-3 px-4 rounded-[40px] w-fit">Inactive</div>;
    }
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
              <NameInitials
                className={`h-12 w-12 font-normal  shadow-sm border border-white text-sm`}
                initials={getInitials(`${props.row.original.firstName} ${props.row.original.lastName}`)}
              />
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
          className="cursor-pointer text-themeBlue dark:text-blue-500 whitespace-nowrap"
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
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      cell: (props) => (
        <h1
        // className="cursor-pointer text-themeBlue dark:text-blue-500 whitespace-nowrap"
        // onClick={() => {
        //   setUserCoursesState({
        //     status: true,
        //     data: props.row.original,
        //   });
        // }}
        >
          {renderStatus(props.row.original.status)}
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
      onError: (data: any) => {
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

      {confirmStatusUpdate.status && (
        <ConfirmationModal
          open={confirmStatusUpdate.status}
          onClose={() => setConfirmStatusUpdate({ status: false, data: null })}
          title={'Update user status'}
          content={`Are you sure you want to update user status?`}
          primaryAction={{
            label: 'Update',
            onClick: () => {
              updateUserStatus(confirmStatusUpdate.data);
            },
            loading: updatingStatus,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => setConfirmStatusUpdate({ status: false, data: null }),
          }}
        />
      )}
    </>
  );
};

export default UserTable;
