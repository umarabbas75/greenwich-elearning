'use client';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { Database } from 'lucide-react';
import { FC } from 'react';

import TableComponent from '@/components/common/Table';
import WebhookStatus from '@/components/common/WebhookStatus';
import { Button } from '@/components/ui/button';
import { warningDetailAtom } from '@/store/modals';

import WarningDetailModal from './WarningDetailModal';

const columnHelper = createColumnHelper<WarningType>();

interface Props {
  data: WarningData;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const WarningTable: FC<Props> = ({
  data,
  pagination,
  setPagination,
  isLoading,
}) => {
  const [warningState, setWarningState] = useAtom(warningDetailAtom);
  const columns = [
    // Accessor Columns
    columnHelper.accessor('created_at', {
      id: 'created_at',
      header: 'Created',
      cell: (props) => (
        <h1>
          {props.row.original.created_at
            ? new Date(props.row.original.created_at ?? '').toDateString()
            : '----'}
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('genset', {
      header: 'Genset Number',
      cell: (props) => {
        return <h1>{props.row.original.genset}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('customer', {
      header: 'Customer',
      cell: (props) => {
        return <h1>{props.row.original.customer || '---'}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (props) => {
        return <h1>{props.row.original.type}</h1>;
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('warning', {
      id: 'warning',
      header: 'Warning',
      cell: (props) => <h1>{props.row.original.warning ?? '---'}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('lat_lng', {
      id: 'lat_lng',
      header: 'Lat/Lng',
      cell: (props) => (
        <h1>
          {props.row.original.data.latitude ?? '---'},{' '}
          {props.row.original.data.longitude ?? '---'}
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('description', {
      id: 'description',
      header: 'Description',
      cell: (props) => <h1>{props.row.original.description ?? '---'}</h1>,
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      cell: (props) => (
        <WebhookStatus status={props.row.original.data.status} />
      ),
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('status', {
      id: 'status1',
      header: '',
      cell: (props) => (
        <Button
          onClick={() => {
            setWarningState({
              status: true,
              data: props.row.original.data,
            });
          }}
        >
          Detail
        </Button>
      ),
      footer: (props) => props.column.id,
    }),
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

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Alarm Webhooks</p>
        {isLoading ? (
          'loading...'
        ) : data.results.length > 0 ? (
          <TableComponent table={table} />
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

      {warningState.status && <WarningDetailModal />}
    </>
  );
};

export default WarningTable;
