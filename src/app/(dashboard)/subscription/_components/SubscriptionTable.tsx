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
import { useDeleteSubscription } from '@/lib/dashboard/client/subscription';
import {
  confirmationModalAtom,
  currenySignAtom,
  subscriptionListModalAtom,
  subscriptionModalAtom,
} from '@/store/modals';
import { formatNumber } from '@/utils/formatNumber';
import { Icons } from '@/utils/icon';

import SubscriptionListModal from './SubscriptionListModal';
import SubscriptionModal from './SubscriptionModal';

const columnHelper = createColumnHelper<SubscriptionType>();

interface Props {
  data: SubscriptionData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const SubscriptionTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [subscriptionState, setSubscriptionState] = useAtom(
    subscriptionModalAtom,
  );
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const [subscriptionListState, setSubscriptionListState] = useAtom(
    subscriptionListModalAtom,
  );
  const { toast } = useToast();

  const [currenySign] = useAtom(currenySignAtom);

  const renderActions = (row: SubscriptionType) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setSubscriptionState({
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
    columnHelper.accessor('name', {
      header: 'Package Name',
      cell: (props) => {
        return <h1>{props.row.original.name}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (props) => {
        return (
          <h1>
            {currenySign.currencySign} {formatNumber(+props.row.original.price)}
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('feature_list', {
      id: 'feature_list',
      header: 'Features',
      cell: (props) => (
        <h1
          className="cursor-pointer underline"
          onClick={() => {
            setSubscriptionListState({
              status: true,
              data: props.row.original.feature_list,
            });
          }}
        >
          {props.row.original.feature_list?.length} Features
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('total_assigned', {
      header: 'Total Assigned',
      cell: (props) => {
        return <h1>{props.row.original.total_assigned}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      cell: (props) => <StatusComp status={props.row.original.status} />,
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<SubscriptionType, string>) => (
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

  const { mutate: deleteSubscription, isLoading: deletingSubscription } =
    useDeleteSubscription(handleDeleteSuccess, handleDeleteError);

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Subscription</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {subscriptionState.status && <SubscriptionModal />}
      {subscriptionListState.status && <SubscriptionListModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Subscription'}
          content={`Are you sure you want to delete this subscription?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteSubscription(confirmState.data.id);
            },
            loading: deletingSubscription,
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

export default SubscriptionTable;
