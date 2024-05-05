'use client';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { addCourseModalAtom, confirmationModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import { Course, CoursesDataResponse } from '../page';

const columnHelper = createColumnHelper<Course>();

interface Props {
  data: CoursesDataResponse;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
}
const CourseTable: FC<Props> = ({ data, pagination, setPagination, isLoading }) => {
  const router = useRouter();
  const [courseModalState, setCourseModalState] = useAtom(addCourseModalAtom);
  console.log({ courseModalState });
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: Course) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setCourseModalState({
              status: true,
              data: row,
            });
            router.push('/course/addCourse');
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
          <Image
            src={props.row.original.image}
            alt="course"
            width={50}
            height={50}
            objectFit="contain"
            className="rounded-full h-12 w-12 object-contain"
          />
        );
      },
      footer: (props) => props.column.id,
    }),
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
    columnHelper.accessor('duration', {
      id: 'duration',
      header: 'Duration',
      cell: (props) => <h1>{props.row.original.duration}</h1>,
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('modules', {
      id: 'units',
      header: 'Units',
      cell: (props) => <h1>{props.row.original.modules?.length}</h1>,
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<Course, string>) => (
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

  const { mutate: deleteCourse, isLoading: deletingCourse } = useApiMutation({
    method: 'delete',
    endpoint: `/courses/${confirmState?.data?.id}`,
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
          queryKey: ['get-courses'],
        });
      },
      onError: (data) => {
        toast({
          variant: 'destructive',
          title: 'Error ',
          description: data?.response?.data?.type?.[0] ?? 'Some error occurred',
        });
      },
    },
  });
  const onRowClick = (data: Course) => {
    router.push(`/course/${data.id}`);
  };

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Courses</p>
        {isLoading ? 'loading...' : <TableComponent table={table} onRowClick={onRowClick} />}

        <div className="h-4" />
      </div>

      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Course'}
          content={`Are you sure you want to delete this course?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteCourse(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingCourse,
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

export default CourseTable;
