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
import StatusComp from '@/components/common/Status';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteGenset } from '@/lib/dashboard/client/genset';
import {
  confirmationModalAtom,
  gensetModalAtom,
  qrCodeModalAtom,
} from '@/store/modals';
import useCanUserAccess from '@/utils/hooks/useCanUserAccess';
import { Icons } from '@/utils/icon';

import GensetModal from './GensetModal';
import QRCodeModal from './QRCodeModal';

const columnHelper = createColumnHelper<GensetsType>();

interface Props {
  data: GensetData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const GensetTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [genState, setGenState] = useAtom(gensetModalAtom);
  const [qrCodeModal, setQrCodeModal] = useAtom(qrCodeModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();

  const [canUpdate, canDelete] = useCanUserAccess({
    module: 'genset',
    access: ['update', 'delete'],
  });

  const renderActions = (row: GensetsType) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        {canUpdate && (
          <span
            onClick={() => {
              setGenState({
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
  const renderStatus = (status: GensetsStatus) => {
    return <StatusComp status={status} />;
  };

  let columns = [
    // Accessor Columns
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (props) => {
        return (
          <h1 className="flex gap-2 items-center">
            {props.row.original.type_icon && (
              <Image
                src={props.row.original.type_icon}
                alt="genset type"
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            {props.row.original.type}
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('genset_id', {
      id: 'interal_number',
      header: 'Genset ID',
      cell: (props) => <h1>{props.row.original.genset_id}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('serial_number', {
      id: 'serial_number',
      header: 'Serial Number',
      cell: (props) => <h1>{props.row.original.serial_number}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('customer', {
      id: 'customer',
      header: 'Customer',
      cell: (props) => <h1>{props.row.original.customer}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('subscription', {
      id: 'subscription',
      header: 'Subscription',
      cell: (props) => <h1>{props.row.original.subscription}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('qr_code', {
      id: 'qr_code',
      header: 'QR Code',
      cell: (props) => (
        <div className="dark:bg-white bg-transparent p-2 rounded-sm w-fit">
          <img
            src={props.row.original.qr_code}
            className="h-12 w-12 rounded-sm cursor-pointer"
            alt="qr image"
            onClick={() =>
              setQrCodeModal({ status: true, data: props.row.original.qr_code })
            }
          />
        </div>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('iot_ready', {
      id: 'iot_ready',
      header: 'Iot Ready',
      cell: (props) =>
        props.row.original.iot_ready ? (
          <Icons
            iconName="tick"
            className="h-6 w-6 cursor-pointer text-green-500"
          />
        ) : (
          <Icons
            iconName="cancel"
            className="h-6 w-6 cursor-pointer text-red-500"
          />
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
      cell: (props: CellContext<GensetsType, string>) => (
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

  const { mutate: deleteGenset, isLoading: deletingGenset } = useDeleteGenset(
    handleDeleteSuccess,
    handleDeleteError,
  );

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Gensets</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>

      {genState.status && <GensetModal />}
      {qrCodeModal.status && <QRCodeModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Genset'}
          content={`Are you sure you want to delete this genset?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteGenset(confirmState.data.id);
            },
            loading: deletingGenset ? true : false,
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

export default GensetTable;
