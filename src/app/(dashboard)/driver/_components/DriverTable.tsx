'use client';
import {
  CellContext,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { useAtom, useSetAtom } from 'jotai';
import { Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import StatusComp from '@/components/common/Status';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { toast } from '@/components/ui/use-toast';
import { useDeleteDriver } from '@/lib/dashboard/client/driver';
import { confirmationModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import { gensetLocationsAtom } from '../../gensetsonmap/_components/Map';

const columnHelper = createColumnHelper<DriverType>();

interface Props {
  data: DriverData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}

const DriverTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const setGensetLodationAtom = useSetAtom(gensetLocationsAtom);
  const router = useRouter();
  const renderStatus = (status: DriverStatus) => {
    return <StatusComp status={status} />;
  };

  const renderActions = (row: DriverType) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
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

  const onRowClick = (row: DriverType) => {
    console.log('rowclick', row);
    const gensetLoc = {
      genset_id: '',
      lat: row?.current_location?.lat,
      lng: row?.current_location?.lng,
      location: row?.current_location?.location,
      driver: row?.name,
      customer: row?.customer,
      status: row?.status,
    };
    setGensetLodationAtom([gensetLoc]);
    router.push('/gensetsonmap');
  };

  const columns = [
    // Accessor Columns
    columnHelper.accessor('name', {
      header: 'Driver Name',
      cell: (props) => {
        return <h1>{props.row.original.name}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('customer', {
      header: 'Customer',
      cell: (props) => {
        return <h1>{props.row.original.customer}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('start_location', {
      id: 'start_location',
      header: 'Start Location',
      cell: (props) => (
        <h1>{props.row.original.start_location?.display_name ?? '---'}</h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('end_location', {
      id: 'end_location',
      header: 'End Location',
      cell: (props) => (
        <h1>{props.row.original.end_location?.display_name ?? '---'}</h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('created_at', {
      id: 'start_date',
      header: 'Start Date',
      cell: (props) => <h1>{props.row.original.created_at.toString()}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('end_date', {
      id: 'end_date',
      header: 'End Date',
      cell: (props) => <h1>{props.row.original.end_date ?? '---'}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('logged_in', {
      id: 'logged_in',
      header: 'Logged In',
      cell: (props) => (
        <h1>
          {formatDistanceToNow(new Date(props.row.original.created_at), {
            addSuffix: true,
          })}
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      cell: (props) => renderStatus(props.row.original.status),
      footer: (props) => props.column.id,
    }),
    {
      id: 'actions',
      cell: (props: CellContext<DriverType, string>) => {
        return <TableActions>{renderActions(props.row.original)}</TableActions>;
      },
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

  const { mutate: deleteDriver, isLoading: deletingDriver } = useDeleteDriver(
    handleDeleteSuccess,
    handleDeleteError,
  );

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Driver</p>
        {isLoading ? (
          'loading...'
        ) : data.results.length > 0 ? (
          <TableComponent table={table} onRowClick={onRowClick} />
        ) : (
          <div className="flex item-center justify-center">
            <div className="flex flex-col items-center opacity-70">
              <span>NO DATA FOUND</span>
              <Database />
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Driver'}
          content={`Are you sure you want to delete this driver?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteDriver(confirmState.data.id);
            },
            loading: deletingDriver,
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

export default DriverTable;
