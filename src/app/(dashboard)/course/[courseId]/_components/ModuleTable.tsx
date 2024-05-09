'use client';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { addModuleModalAtom, confirmationModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import { Module, ModulesDataResponse } from '../page';

import ModuleModal from './ModuleModal';

const columnHelper = createColumnHelper<Module>();

interface Props {
  data: ModulesDataResponse;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
  courseId: string;
}
const ModuleTable: FC<Props> = ({ data, pagination, setPagination, isLoading, courseId }) => {
  const router = useRouter();
  const [moduleModalState, setModuleModalState] = useAtom(addModuleModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: Module) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setModuleModalState({
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
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
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

    columnHelper.accessor('chapters', {
      id: 'elements',
      header: 'Elements',
      cell: (props) => <h1>{props.row.original.chapters.length}</h1>,
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<Module, string>) => (
        <TableActions>{renderActions(props.row.original)}</TableActions>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data,
    columns,
    pageCount: Math.ceil(data?.data?.length / 10),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteModule, isLoading: deletingModule } = useApiMutation({
    method: 'delete',
    endpoint: `/courses/module/${confirmState?.data?.id}`,
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
          queryKey: ['get-modules', courseId],
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

  const onRowClick = (data: Module) => {
    router.push(`/course/${courseId}/${data.id}`);
  };

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Unit</p>
        {isLoading ? 'loading...' : <TableComponent table={table} onRowClick={onRowClick} />}

        <div className="h-4" />
      </div>

      {moduleModalState.status && <ModuleModal courseId={courseId} />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Module'}
          content={`Are you sure you want to delete this module?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteModule(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingModule,
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

export default ModuleTable;
