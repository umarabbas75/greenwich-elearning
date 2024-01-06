'use client';
import {
  CellContext,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { FC } from 'react';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteUser } from '@/lib/dashboard/client/user';
import { confirmationModalAtom, userModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import UserModal from './UserModal';

const columnHelper = createColumnHelper<UserType>();

interface Props {
  data: UserData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const UserTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [userState, setUserState] = useAtom(userModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: UserType) => {
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
    columnHelper.accessor('photo', {
      header: 'Photo',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            {props.row.original.photo ? (
              <Image
                src={props.row.original.photo}
                alt="genset type"
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
    columnHelper.accessor('first_name', {
      header: 'Name',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            <span>
              {`${props.row.original.first_name} ${props.row.original.last_name}`}
            </span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('customer', {
      header: 'Company',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            <span>{props.row.original.customer ?? '---'}</span>
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
    columnHelper.accessor('location', {
      id: 'location',
      header: 'Location',
      cell: (props) => <h1>{props.row.original.location?.display_name}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('role', {
      id: 'role',
      header: 'Role',
      cell: (props) => <h1>{props.row.original.role}</h1>,
      footer: (props) => props.column.id,
    }),
    // columnHelper.accessor('status', {
    //   id: 'status',
    //   header: 'Status',
    //   cell: (props) => <StatusComp status={props.row.original.status} />,
    //   footer: (props) => props.column.id,
    // }),

    {
      id: 'actions',
      cell: (props: CellContext<UserType, string>) => (
        <TableActions>{renderActions(props.row.original)}</TableActions>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.results,
    columns,
    pageCount: Math.ceil(data?.count / 10),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  const handleDeleteSuccess = () => {
    setConfirmState({
      ...confirmState,
      status: false,
      data: null,
    });
    setConfirmState({ status: false, data: null });
    toast({
      variant: 'success',
      title: 'Success ',
      description: 'Data deleted successfully',
    });
  };
  const handleDeleteError = (data: any) => {
    toast({
      variant: 'destructive',
      title: 'Error ',
      description: data?.response?.data?.type?.[0] ?? 'Some error occured',
    });
  };

  const { mutate: deleteUser, isLoading: deletingUser } = useDeleteUser(
    handleDeleteSuccess,
    handleDeleteError,
  );

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Users</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {userState.status && <UserModal />}
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
