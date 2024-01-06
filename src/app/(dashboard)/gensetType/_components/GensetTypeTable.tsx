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
import { useDeleteGensetType } from '@/lib/dashboard/client/gensetType';
import { confirmationModalAtom, gensetTypeModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import CategoryModal from './GensetTypeModal';

const columnHelper = createColumnHelper<TypesGensetType>();

interface Props {
  data: TypesGensetData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const GensetTypeTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [genTypeState, setGenTypeState] = useAtom(gensetTypeModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: TypesGensetType) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setGenTypeState({
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
    columnHelper.accessor('image', {
      header: 'Image',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center">
            {props.row.original.image && (
              <Image
                src={props.row.original.image}
                alt="genset type"
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (props) => {
        return <h1>{props.row.original.name}</h1>;
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('description', {
      id: 'Description',
      header: 'Description',
      cell: (props) => <h1>{props.row.original.description}</h1>,
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<TypesGensetType, string>) => (
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

  const { mutate: deleteGensetType, isLoading: deletingGensetType } =
    useDeleteGensetType(handleDeleteSuccess, handleDeleteError);

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Types</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {genTypeState.status && <CategoryModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Genset Type'}
          content={`Are you sure you want to delete this genset type`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteGensetType(confirmState.data.id);
            },
            loading: deletingGensetType,
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

export default GensetTypeTable;
