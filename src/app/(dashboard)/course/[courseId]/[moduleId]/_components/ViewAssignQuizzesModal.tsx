import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';

import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import TableComponent from '@/components/common/Table';
import { useApiGet } from '@/lib/dashboard/client/user';
import { viewAssignedQuizzesModal } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

const ViewAssignQuizzesModal = () => {
  const [viewAssignQuizModalState, setViewAssignQuizModalState] = useAtom(viewAssignedQuizzesModal);
  const closeModal = () => {
    setViewAssignQuizModalState({
      ...viewAssignQuizModalState,
      status: false,
      data: null,
    });
  };

  const { data: assignedQuizzes, isLoading: fetchingAssignedQuizzes } = useApiGet<any>({
    endpoint: `/quizzes/getAllAssignQuizzes/${viewAssignQuizModalState?.data?.id}`,
    queryKey: ['get-all-assigned-quizzes', viewAssignQuizModalState?.data?.id],
    config: {
      enabled: !!viewAssignQuizModalState?.data?.id,
    },
  });
  const columnHelper = createColumnHelper<any>();

  const columns = [
    // Accessor Columns

    columnHelper.accessor('question', {
      header: 'Question',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-start w-fit ">
            <span className="max-w-[200px]">{`${props.row.original.question}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('options', {
      id: 'options',
      header: 'Options',
      cell: (props) => (
        <h1>
          {props.row.original.options?.map((item: any) => {
            return (
              <span key={item} className="inline-block p-2 border rounded-sm mx-1">
                {item}
              </span>
            );
          })}
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('answer', {
      id: 'answer',
      header: 'Answer',
      cell: (props) => <h1>{props.row.original.answer}</h1>,
      footer: (props) => props.column.id,
    }),
  ];
  const table = useReactTable({
    data: assignedQuizzes?.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Modal
      open={viewAssignQuizModalState.status}
      onClose={() => {
        closeModal();
      }}
      title={'Assign Quizzes'}
    >
      {fetchingAssignedQuizzes ? (
        <Spinner />
      ) : (
        // <div className="flex flex-wrap gap-4">
        //   {assignedQuizzes?.data?.map((item: any, index: number) => {
        //     return <h1 key={index}>{'test'}</h1>;
        //   })}
        // </div>
        <TableComponent table={table} />
      )}
    </Modal>
  );
};

export default ViewAssignQuizzesModal;
