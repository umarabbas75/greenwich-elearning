import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom, useSetAtom } from 'jotai';
import { ArrowLeft, Undo } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { MdOutlineDone } from 'react-icons/md';
import { MdOutlineClose } from 'react-icons/md';
import { MdOutlinePaid } from 'react-icons/md';
import { MdMoneyOff } from 'react-icons/md';

import Grades from '@/app/(studentDashboard)/studentCourses/[courseId]/_components/Grades';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import TableComponent from '@/components/common/Table';
import TableActions from '@/components/common/TableActions';
import { useApiGet } from '@/lib/dashboard/client/user';
import {
  coursePaymentConfirmModalAtom,
  courseStatusConfirmModalAtom,
  unAssignCourseModalAtom,
  viewUserCoursesModal,
} from '@/store/modals';
import { Icons } from '@/utils/icon';
/* const MAX_FILE_SIZE = 102400; */

const ViewUserCoursesModal = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<any>(null);
  const setConfirmState = useSetAtom(unAssignCourseModalAtom);
  const [userCoursesState, setUserCoursesState] = useAtom(viewUserCoursesModal);
  const setCourseStatusConfirm = useSetAtom(courseStatusConfirmModalAtom);

  const setCoursePaymentConfirm = useSetAtom(coursePaymentConfirmModalAtom);

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
  const renderActions = (row: any) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        <span
          onClick={() => {
            setConfirmState({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          <Undo />
          Unassign Course
        </span>

        <span
          onClick={() => {
            setCourseStatusConfirm({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          {row?.isActive === false ? <MdOutlineDone size={22} /> : <MdOutlineClose size={22} />}
          {row?.isActive === false ? 'Activate Course' : 'Deactivate Course'}
        </span>

        <span
          onClick={() => {
            setCoursePaymentConfirm({
              status: true,
              data: row,
            });
          }}
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
        >
          {row?.isPaid === false ? <MdOutlinePaid size={22} /> : <MdMoneyOff size={22} />}
          {row?.isPaid === false ? 'Amount Paid' : 'Amount Unpaid'}
        </span>
      </div>
    );
  };
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

    columnHelper.accessor('isActive', {
      id: 'isActive',
      header: 'Course status',
      cell: (props) => <h1>{props.row.original.isActive === true ? 'Active' : 'Inactive'}</h1>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('isPaid', {
      id: 'isPaid',
      header: 'Payment status',
      cell: (props) => <h1>{props.row.original.isPaid === true ? 'Paid' : 'Unpaid'}</h1>,
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
    {
      id: 'actions',
      cell: (props: CellContext<any, string>) => (
        <TableActions>{renderActions(props.row.original)}</TableActions>
      ),
    },
  ];

  const table = useReactTable({
    data: assignedCourses?.data,
    columns,
    // pageCount: Math.ceil(assignedCourses?.data.length / 10),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Modal
        open={userCoursesState.status}
        onClose={() => {
          closeModal();
        }}
        title={'Assigned Courses'}
        className="max-w-[80vw] h-[100vh] !w-[100vw]"
      >
        {fetchingUser ? (
          <Spinner />
        ) : assignedCourses?.data?.length > 0 ? (
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

                <Grades
                  userId={userCoursesState?.data?.id}
                  courseIdProp={selectedCourseId?.id}
                  courseNameProp={selectedCourseId?.title}
                />
              </div>
            ) : (
              <TableComponent table={table} />
            )}
          </div>
        ) : (
          'No courses found!'
        )}
      </Modal>
    </>
  );
};

export default ViewUserCoursesModal;
