'use client';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import StatusComp from '@/components/common/Status';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { confirmationModalAtom, forumModalAtom, updateStatusModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';
import { formatDate } from '@/utils/utils';

import ForumModal from './ForumModal';

const columnHelper = createColumnHelper<any>();

const UserTable = ({ data, pagination, setPagination, isLoading }: any) => {
  const [forumState, setForumState] = useAtom(forumModalAtom);
  const [selectedForumThread, setSelectedForumThread] = useState('');
  const queryClient = useQueryClient();
  const { data: userData } = useSession();

  const [updateStatusState, setUpdateStatusState] = useAtom(updateStatusModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const router = useRouter();
  const { mutate: changeForumStatus, isLoading: changingForumStatus } = useApiMutation<any>({
    endpoint: `/forum-thread/update/${selectedForumThread}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
        setUpdateStatusState({ status: false, data: null });
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Status updated successfully',
        });
      },
    },
  });

  const { mutate: deleteForumThread, isLoading: deletingForumThread } = useApiMutation({
    method: 'delete',
    endpoint: `/forum-thread/delete/${confirmState?.data?.id}`,
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
          queryKey: ['get-forum-threads'],
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

  const renderActions = (data: any) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
          // onClick={() => {
          //   const payload = {
          //     status: data.status === 'inActive' ? 'active' : 'inActive',
          //   };
          //   setSelectedForumThread(data.id);
          //   changeForumStatus(payload);

          // }}
          onClick={() => {
            setSelectedForumThread(data.id);
            const payload = {
              status: data.status === 'inActive' ? 'active' : 'inActive',
            };
            setUpdateStatusState({
              status: true,
              data: payload,
            });
          }}
        >
          <Icons iconName="toggle" />
          {changingForumStatus ? 'loading...' : data.status === 'inActive' ? 'Activate' : 'Deactivate'}
        </span>

        <span
          onClick={() => {
            setForumState({
              status: true,
              data: data,
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
              data: data,
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

  const renderStatus = (status: any) => {
    return <StatusComp status={status} />;
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            <span>{`${props.row.original.title ?? ''}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('user', {
      id: 'startedBy',
      header: 'Started by',
      cell: (props) => (
        <h1>{`${props.row.original.user?.firstName ?? ''} ${props.row.original.user?.lastName}`}</h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: 'Started date',
      cell: (props) => <h1>{formatDate(props.row.original.createdAt)}</h1>,
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('lastPostBy', {
      id: 'lastPostBy',
      header: 'Last post',
      cell: (props) => (
        <h1>
          {props.row.original.ForumComment?.[props.row.original.ForumComment?.length - 1]?.user?.firstName}
        </h1>
      ),
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('lastPostDate', {
      id: 'lastPostDate',
      header: 'Last post date',
      cell: (props) => (
        <h1>
          {formatDate(
            props.row.original.ForumComment?.[props.row.original.ForumComment?.length - 1]?.createdAt,
          )}
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('numOfReplies', {
      id: 'numOfReplies',
      header: 'Replies',
      cell: (props) => <h1>{props.row.original?.ForumComment?.length}</h1>,
      footer: (props) => props.column.id,
    }),
  ];

  if (userData?.user?.role === 'admin') {
    columns.push(
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        cell: (props) => renderStatus(props.row.original.status),
        footer: (props) => props.column.id,
      }),
    );
    columns.push({
      id: 'actions',
      cell: (props: any) =>
        userData?.user?.role === 'admin' && <TableActions>{renderActions(props.row.original)}</TableActions>,
    });
  }

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
  const onRowClick = (data: any) => {
    router.push(`/forum/${data.id}`);
  };

  return (
    <>
      {forumState.status && <ForumModal />}

      <div className=" border rounded bg-white p-4 pt-0">
        {isLoading ? 'loading...' : <TableComponent table={table} onRowClick={onRowClick} />}

        <div className="h-4" />
      </div>

      {updateStatusState.status && (
        <ConfirmationModal
          open={updateStatusState.status}
          onClose={() => {
            setUpdateStatusState({ status: false, data: null });
            setSelectedForumThread('');
          }}
          title={'Change Status'}
          content={`Are you sure you want to change the status of this forum thread?`}
          primaryAction={{
            label: 'Yes',
            onClick: () => {
              changeForumStatus(updateStatusState.data);
              //setUpdateStatusState({ status: false, data: null });
            },
            loading: changingForumStatus,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => {
              setUpdateStatusState({ status: false, data: null });
              setSelectedForumThread('');
            },
          }}
        />
      )}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => {
            setConfirmState({ status: false, data: null });
          }}
          title={'Delete Forum Thread'}
          content={`Are you sure you want to delete this forum thread?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteForumThread(confirmState.data.id);
              //setUpdateStatusState({ status: false, data: null });
            },
            loading: deletingForumThread,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => {
              setConfirmState({ status: false, data: null });
            },
          }}
        />
      )}
    </>
  );
};

export default UserTable;
