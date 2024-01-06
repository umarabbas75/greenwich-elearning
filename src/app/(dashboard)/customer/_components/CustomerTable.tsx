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
import { useDeleteCustomer } from '@/lib/dashboard/client/customer';
import { confirmationModalAtom, customerModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import CustomerModal from './CustomerModal';

const columnHelper = createColumnHelper<CustomerType>();

interface Props {
  data: CustomerData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const CustomerTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [customerState, setCustomerState] = useAtom(customerModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: CustomerType) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setCustomerState({
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
    columnHelper.accessor('customer_id', {
      header: 'Customer ID',
      cell: (props) => {
        return <h1>{props.row.original.customer_id ?? '---'}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('company', {
      header: 'Company',
      cell: (props) => {
        return <h1>{props.row.original.company ?? '---'}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('first_name', {
      header: 'First Name',
      cell: (props) => {
        return <h1>{props.row.original.first_name}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('last_name', {
      header: 'Last Name',
      cell: (props) => {
        return <h1>{props.row.original.last_name}</h1>;
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
      cell: (props) => (
        <h1>
          {props.row.original?.custom_address
            ? props.row.original?.custom_address
            : props.row.original.location?.display_name
            ? props.row.original.location?.display_name
            : '---'}
        </h1>
      ),
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
      cell: (props: CellContext<CustomerType, string>) => (
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

  const { mutate: deleteCustomer, isLoading: deletingCustomer } =
    useDeleteCustomer(handleDeleteSuccess, handleDeleteError);

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Customer</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {customerState.status && <CustomerModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Customer'}
          content={`Are you sure you want to delete this customer?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteCustomer(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingCustomer,
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

export default CustomerTable;
