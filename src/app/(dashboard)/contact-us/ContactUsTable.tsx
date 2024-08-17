'use client';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { FC } from 'react';

import TableComponent from '@/components/common/Table';
import { viewContactMessage } from '@/store/modals';

import ViewContactMessage from './ViewContactMessage';

const columnHelper = createColumnHelper<any>();

const ContactUsTable: FC<any> = ({ data, pagination, setPagination, isLoading }) => {
  const [isModelOpen, setIsModelOpen] = useAtom(viewContactMessage);

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (props) => {
        return (
          <h1 className="">
            <span>{`${props.row.original.user?.firstName} ${props.row.original.user?.lastName}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('email', {
      header: 'Email',
      cell: (props) => {
        return (
          <h1 className="">
            <span>{`${props.row.original.user.email}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (props) => {
        return (
          <h1 className="">
            <span>{`${props.row.original.user.phone}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('message', {
      id: 'message',
      header: 'Message',
      cell: (props) => {
        const fullMessage = props.row.original.message;
        const shortMessage = fullMessage.length > 100 ? `${fullMessage.substring(0, 100)}...` : fullMessage;
        return (
          <h1
            className="text-themeBlue cursor-pointer"
            onClick={() => {
              setIsModelOpen({
                data: fullMessage,
                status: true,
              });
            }}
          >
            {`${shortMessage}`}
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
  ];

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

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Messages</p>
        {isLoading ? 'loading...' : <TableComponent table={table} />}

        <div className="h-4" />
      </div>
      {isModelOpen && <ViewContactMessage />}
    </>
  );
};

export default ContactUsTable;
