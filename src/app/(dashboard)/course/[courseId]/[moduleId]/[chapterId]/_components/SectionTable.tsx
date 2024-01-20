'use client';
import {
  CellContext,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { FC } from 'react';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteUser } from '@/lib/dashboard/client/user';
import { confirmationModalAtom, userModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import {
  ChapterData,
  SectionType,
} from '../../../../../../../../types/course.types';

import SectionModal from './SectionModal';

const columnHelper = createColumnHelper<SectionType>();

interface Props {
  data: ChapterData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const SectionTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [courseModalState, setCourseModalState] = useAtom(userModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: SectionType) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setCourseModalState({
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

    columnHelper.accessor('title', {
      header: 'Title',
      cell: (props) => {
        return (
          <h1 className="">
            <span>{`${props.row.original.title}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('description', {
      id: 'description',
      header: 'Description',
      cell: (props) => <h1>{props.row.original.description}</h1>,
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<SectionType, string>) => (
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
        <p className="pl-2 font-medium mb-4">Sections</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {courseModalState.status && <SectionModal />}
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

export default SectionTable;
