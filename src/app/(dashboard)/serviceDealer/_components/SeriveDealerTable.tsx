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
import StatusComp from '@/components/common/Status';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteServiceDealer } from '@/lib/dashboard/client/seriveDealer';
import { confirmationModalAtom, serviceDealerModalAtom } from '@/store/modals';
import useCanUserAccess from '@/utils/hooks/useCanUserAccess';
import { Icons } from '@/utils/icon';

import ServiceDealerModal from './ServiceDealerModal';

const columnHelper = createColumnHelper<ServiceDealerType | any>();

interface Props {
  data: ServiceDealerData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const SeriveDealerTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [serviceDealerState, setServiceDealerState] = useAtom(
    serviceDealerModalAtom,
  );
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();

  const [canUpdate, canDelete] = useCanUserAccess({
    module: 'serviceDealer',
    access: ['update', 'delete'],
  });

  const renderActions = (row: ServiceDealerType) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        {canUpdate && (
          <span
            onClick={() => {
              setServiceDealerState({
                status: true,
                data: row,
              });
            }}
            className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
          >
            <Icons iconName="edit" className="w-6 h-6 cursor-pointer" />
            Edit
          </span>
        )}

        {canDelete && (
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
        )}
      </div>
    );
  };

  const openClose = (props: any) => {
    const { opening_hours } = props.row.original || {};
    const currentFullDay = new Date().toLocaleString('en-us', {
      weekday: 'long',
    });
    const currentObj = opening_hours?.filter(
      (item: any) => item.label === currentFullDay,
    )?.[0];
    const start_time = currentObj?.start_time;
    const end_time = currentObj?.end_time;
    //return false if current time is less and greater than start_time and end_time
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    });
    const isClose = currentTime < start_time || currentTime > end_time;
    return isClose ? (
      <div className="text-red-500">Close</div>
    ) : (
      <div className="text-green-500">Open</div>
    );
  };

  let columns = [
    // Accessor Columns
    columnHelper.accessor('station_name', {
      header: 'Station Name',
      cell: (props) => {
        return <h1>{props.row.original.station_name}</h1>;
      },
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
      cell: (props) => (
        <h1>{props.row.original.location?.display_name ?? ''}</h1>
      ),
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      cell: (props) => <StatusComp status={props.row.original.status} />,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('', {
      id: 'openclose',
      cell: (props) => <>{openClose(props)}</>,
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<ServiceDealerType, string>) => (
        <TableActions>{renderActions(props.row.original)}</TableActions>
      ),
    },
  ];
  if (!canUpdate && !canDelete) {
    columns = columns.filter((col) => col.id !== 'actions');
  }

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
  const { mutate: deleteSeriveDealer, isLoading: deletingSeriveDealer } =
    useDeleteServiceDealer(handleDeleteSuccess, handleDeleteError);

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Service Dealers</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {serviceDealerState.status && <ServiceDealerModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Service Dealer'}
          content={`Are you sure you want to delete this service dealer`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteSeriveDealer(confirmState.data.id);
            },
            loading: deletingSeriveDealer,
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

export default SeriveDealerTable;
