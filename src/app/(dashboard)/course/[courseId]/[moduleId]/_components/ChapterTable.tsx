'use client';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import { FC } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import {
  addChapterModalAtom,
  assignQuizzesModalAtom,
  confirmationModalAtom,
  viewAssignedQuizzesModal,
} from '@/store/modals';
import { Icons } from '@/utils/icon';

import { Chapter, ChaptersDataResponse } from '../page';

import AssignQuizModal from './AssignQuizModal';
import UserModal from './ChapterModal';
import ViewAssignQuizzesModal from './ViewAssignQuizzesModal';

const columnHelper = createColumnHelper<Chapter>();

interface Props {
  data: ChaptersDataResponse;
  pagination: Pagination;
  setPagination: any;
  isLoading: boolean;
  moduleId: string;
}
const ChapterTable: FC<Props> = ({ data, pagination, setPagination, isLoading, moduleId }) => {
  const router = useRouter();
  const params = useParams();
  const { courseId } = params || {};
  const queryClient = useQueryClient();
  const [chapterModalState, setChapterModalState] = useAtom(addChapterModalAtom);
  const [viewAssignQuizModalState, setViewAssignQuizModalState] = useAtom(viewAssignedQuizzesModal);
  const [assignQuizesState, setAssignQuizesState] = useAtom(assignQuizzesModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { toast } = useToast();
  const renderActions = (row: Chapter) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setAssignQuizesState({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          <Icons iconName="edit" className="w-6 h-6 cursor-pointer" />
          Assign quiz questions
        </span>
        <span
          onClick={() => {
            setChapterModalState({
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
          <h1 className="">
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
    columnHelper.accessor('sections', {
      id: 'sections',
      header: 'Lessons',
      cell: (props) => <h1>{props.row.original.sections?.length}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('quizzes', {
      id: 'quizzes',
      header: 'Quizzes',
      cell: (props) => (
        <h1
          className="cursor-pointer text-themeBlue"
          onClick={(e) => {
            e.stopPropagation();
            setViewAssignQuizModalState({
              status: true,
              data: props.row.original,
            });
          }}
        >
          View
        </h1>
      ),
      footer: (props) => props.column.id,
    }),

    {
      id: 'actions',
      cell: (props: CellContext<Chapter, string>) => (
        <TableActions>{renderActions(props.row.original)}</TableActions>
      ),
    },
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

  const { mutate: deleteChapter, isLoading: deletingChapter } = useApiMutation({
    method: 'delete',
    endpoint: `/courses/chapter/${confirmState?.data?.id}`,
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
          queryKey: ['get-chapters', moduleId],
        });
      },
      onError: (data) => {
        toast({
          variant: 'destructive',
          title: 'Error ',
          description: data?.response?.data?.type?.[0] ?? 'Some error occured',
        });
      },
    },
  });

  const onRowClick = (data: Chapter) => {
    router.push(`/course/${courseId}/${moduleId}/${data.id}`);
  };

  return (
    <>
      <div className="p-2 border rounded">
        <p className="pl-2 font-medium mb-4">Elements</p>
        {isLoading ? 'loading...' : <TableComponent table={table} onRowClick={onRowClick} />}

        <div className="h-4" />
      </div>

      {chapterModalState.status && <UserModal />}
      {assignQuizesState.status && <AssignQuizModal />}
      {viewAssignQuizModalState.status && <ViewAssignQuizzesModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Element'}
          content={`Are you sure you want to delete this element?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteChapter(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingChapter,
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

export default ChapterTable;
