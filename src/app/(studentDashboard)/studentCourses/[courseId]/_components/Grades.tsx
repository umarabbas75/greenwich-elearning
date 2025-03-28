import ReactPDF from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import StatusComponent from '@/components/common/StatusComponent';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import NameInitials from '@/components/NameInitials';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { formatDate, getInitials } from '@/utils/utils';

import PDFReport from './PDFReport';

const Grades = ({
  userId,
  courseIdProp,
  courseNameProp,
}: { courseIdProp?: any; courseNameProp?: any; type?: string; userId?: string } = {}) => {
  const { courseId } = useParams();
  const courseIdParam = courseId ?? courseIdProp;
  // const [courseProgressState, setCourseProgressState] = useAtom(courseProgressAtom);

  const columns = ['Name', 'Status', 'Progress', 'Contribution', 'Quiz Correct', 'Grade'];

  const { data, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/report/${courseIdParam}/${userId}`,
    queryKey: ['get-course-report', courseIdParam],
    config: {
      enabled: !!courseIdParam,
      select: (res) => res?.data,
      keepPreviousData: true,
    },
  });

  const { data: courseDates, isLoading: courseDatesLoading } = useApiGet<any, Error>({
    endpoint: `/courses/report/dates/${courseIdParam}/${userId}`,
    queryKey: ['get-course-dates', courseIdParam],
    config: {
      enabled: !!courseIdParam,
      select: (res) => res?.data?.data,
      keepPreviousData: true,
    },
  });
  console.log({ courseDates });

  const grades = data?.data;
  const userDetails = data?.user;

  // Function to calculate sum of contributions
  function calculateTotalContribution(data: any) {
    let sum = 0;

    // Loop through each module using for...of
    // eslint-disable-next-line @next/next/no-assign-module-variable
    for (const module of data) {
      // Loop through each chapter within the module using for...of
      for (const chapter of module.chapters) {
        // Add the contribution value to the sum
        sum += parseFloat(chapter.contribution);
      }
    }

    return sum;
  }

  const courseProgress = grades?.length > 0 ? calculateTotalContribution(grades) : 0;
  const renderQuizGrade = (row: any) => {
    const percentage = (row._count?.QuizAnswer * 100) / row?._count?.quizzes;
    return isNaN(percentage) ? (0).toFixed(2) : percentage?.toFixed(2);
  };

  const renderStatus = (row: any) => {
    const status =
      row?._count?.LastSeenSection > 0 ? (+row?.progress === 100 ? 'completed' : 'Inprogress') : 'notOpened';
    return status;
  };

  return (
    <div>
      <div className="pb-8">
        <ReportHeader
          courseProgressState={courseProgress}
          columns={columns}
          grades={grades}
          courseNameProp={courseNameProp}
          userDetails={userDetails}
          courseDates={courseDates}
        />
        {isLoading || courseDatesLoading ? (
          <TableSkeletonLoader />
        ) : (
          <div className="py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-black text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grades?.map((item: any, index: any) => (
                    <React.Fragment key={index}>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <td colSpan={columns.length} className="px-5 py-3 font-semibold text-left">
                          {item.title}
                        </td>
                      </tr>
                      {item?.chapters?.map((row: any, rowIndex: any) => (
                        <tr key={rowIndex} className="bg-white dark:bg-black">
                          <td className="px-5 py-5 border-b border-gray-200 bg-white dark:bg-black text-sm">
                            {row.title}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white dark:bg-black text-sm">
                            {<StatusComponent status={renderStatus(row)} />}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white dark:bg-black text-sm">
                            {isNaN(row?.progress) ? 0 : row.progress}%
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white dark:bg-black text-sm">
                            {isNaN(row.contribution) ? 0 : row.contribution}%
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white dark:bg-black text-sm">
                            {row._count?.QuizAnswer}/{row?._count?.quizzes}
                          </td>{' '}
                          <td className="px-5 py-5 border-b border-gray-200 bg-white dark:bg-black text-sm">
                            {renderQuizGrade(row)}%
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;

const ReportHeader = ({
  courseProgressState,
  columns,
  grades,
  courseNameProp,
  userDetails,
  courseDates,
}: any) => {
  const session = useSession();
  const search = useSearchParams();
  const courseName = search.get('title') ?? courseNameProp;

  const instituteName = 'Greenwich Training & consulting';
  const instituteAddress = 'Islamabad, Pakistan';

  const getNewDocument = async () => {
    return new Promise((resolve) => {
      resolve(
        <Document>
          <PDFReport
            session={session}
            userDetails={userDetails}
            courseName={courseName}
            courseProgressState={courseProgressState}
            instituteName={instituteName}
            instituteAddress={instituteAddress}
            columns={columns}
            grades={grades}
            courseDates={courseDates}
            startDate={
              courseDates?.courseStartDate ? formatDate(courseDates?.courseStartDate, 'MMMM d, yyyy') : '----'
            }
          />
        </Document>,
      );
    });
  };
  const [pdfData, setPdfData] = useState<any>({
    blob: '',
    url: '',
  });
  useEffect(() => {
    try {
      const preparePDF = async () => {
        const document: any = await getNewDocument();
        const blob = await ReactPDF.pdf(document).toBlob();

        const url = URL.createObjectURL(blob);
        setPdfData({
          blob: blob,
          url: url,
        });
      };
      session && grades && preparePDF();
    } catch (error) {
      console.log({ error });
    }
  }, [session, courseProgressState, grades]);

  return (
    <div className="course-report grid grid-cols-1 md:grid-cols-5 gap-4 bg-white dark:bg-black shadow-md rounded-lg overflow-hidden">
      <div className="col-span-2 student-info px-6 py-4 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 ">
        {userDetails?.photo ? (
          <img
            className="w-24 h-24 rounded-full object-cover mb-4"
            src={userDetails?.photo}
            alt="User Photo"
          />
        ) : (
          <NameInitials
            className={`w-20 h-20 font-normal  shadow-sm border border-white text-xl`}
            initials={getInitials(`${userDetails?.firstName} ${userDetails?.lastName}`)}
          />
        )}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white/80">{`${
          userDetails?.firstName ?? ''
        } ${userDetails?.lastName ?? ''}`}</h2>
        <p className="text-gray-600 dark:text-white/70 text-sm">{userDetails?.email ?? ''}</p>
        <p className="text-gray-600 dark:text-white/70 text-sm">{userDetails?.phone ?? ''}</p>
      </div>
      <div className="col-span-3 course-details p-6 flex flex-col gap-4">
        <div className="flex justify-between gap-2 items-start">
          <h2 className="text-xl flex-1 font-bold text-gray-800 dark:text-white/80">{courseName}</h2>
          <div className="flex items-center justify-end gap-2">
            <span className="font-medium text-gray-700 dark:text-white/80">Status:</span>
            <span className="text-gray-800 dark:text-white/90">
              {courseProgressState === 100 ? 'Completed' : 'In progress'}
            </span>
          </div>
        </div>
        <div className="progress flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-white">Progress:</span>
          <span className="text-gray-800  dark:text-primary">
            {courseProgressState ? courseProgressState?.toFixed(2) : 0}%
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div style={{ width: `${courseProgressState}%` }} className="bg-green-500 rounded-full h-2"></div>
          </div>
        </div>
        <div className="institute-info">
          <p className="text-gray-800 dark:text-white/80">{instituteName}</p>
          <p className="text-gray-800 dark:text-white/80">{instituteAddress}</p>
        </div>
        <div className="flex justify-between items-center">
          <Button>
            {' '}
            <a
              target="_blank"
              href={pdfData?.url}
              download="course_report.pdf"
              style={{ textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '5px' }}
              rel="noreferrer"
            >
              Download Report
            </a>
          </Button>

          <div className="date text-gray-500 text-right text-xs">
            Course start date:{' '}
            {courseDates?.courseStartDate ? formatDate(courseDates?.courseStartDate, 'MMMM d, yyyy') : '---'}
          </div>
        </div>
      </div>
    </div>
  );
};
