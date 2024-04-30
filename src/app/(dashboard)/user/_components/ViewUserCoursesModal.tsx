import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import Grades from '@/app/(studentDashboard)/studentCourses/[courseId]/_components/Grades';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import TableComponent from '@/components/common/Table';
import { useApiGet } from '@/lib/dashboard/client/user';
import { viewUserCoursesModal } from '@/store/modals';
import { Icons } from '@/utils/icon';
/* const MAX_FILE_SIZE = 102400; */

const ViewUserCoursesModal = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<any>(null);
  const [userCoursesState, setUserCoursesState] = useAtom(viewUserCoursesModal);
  const closeModal = () => {
    setUserCoursesState({
      ...userCoursesState,
      status: false,
      data: null,
    });
  };

  const { data: assignedCourses, isLoading: fetchingUser } = useApiGet<any>({
    endpoint: `/courses/getAllAssignedCourses/${userCoursesState?.data?.id}`,
    queryKey: ['get-user', userCoursesState?.data?.id],
    config: {
      enabled: !!userCoursesState?.data?.id,
    },
  });
  const columnHelper = createColumnHelper<any>();

  const columns = [
    // Accessor Columns
    columnHelper.accessor('image', {
      header: 'Photo',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            {props.row.original.image ? (
              <Image
                src={props.row.original.image}
                alt="course"
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <Icons iconName="avatar" className="h-12 w-12" />
            )}
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (props) => {
        return (
          <h1 className="flex  flex-col justify-center w-fit text-center items-center">
            <span>{`${props.row.original.title ?? ''}`}</span>
          </h1>
        );
      },
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('percentage', {
      id: 'percentage',
      header: 'Completed',
      cell: (props) => <h1>{props.row.original.percentage?.toFixed(2)}%</h1>,
      footer: (props) => props.column.id,
    }),

    columnHelper.accessor('report', {
      id: 'report',
      header: 'Report',
      cell: (props) => (
        <h1
          className="text-themeBlue cursor-pointer"
          onClick={() => {
            setSelectedCourseId(props.row.original);
          }}
        >
          View Report
        </h1>
      ),
      footer: (props) => props.column.id,
    }),
  ];

  const table = useReactTable({
    data: assignedCourses?.data,
    columns,
    // pageCount: Math.ceil(assignedCourses?.data.length / 10),
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Modal
      open={userCoursesState.status}
      onClose={() => {
        closeModal();
      }}
      title={'Assigned Courses'}
    >
      {fetchingUser ? (
        <Spinner />
      ) : (
        <div className="">
          {selectedCourseId ? (
            <div>
              <div className="mb-2">
                <button
                  className="flex gap-1 items-center"
                  onClick={() => {
                    setSelectedCourseId(null);
                  }}
                >
                  <ArrowLeft />
                  back
                </button>
              </div>

              <Grades courseIdProp={selectedCourseId?.id} courseNameProp={selectedCourseId?.title} />
            </div>
          ) : (
            <TableComponent table={table} />
          )}
        </div>
      )}
    </Modal>
  );
};

export default ViewUserCoursesModal;
