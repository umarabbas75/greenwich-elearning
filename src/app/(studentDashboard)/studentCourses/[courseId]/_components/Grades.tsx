import ReactPDF from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
import { useAtom } from 'jotai';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import StatusComponent from '@/components/common/StatusComponent';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { courseProgressAtom, userPhotoAtom } from '@/store/course';

import PDFReport from './PDFReport';

const Grades = ({
  type,
  courseIdProp,
  courseNameProp,
}: { courseIdProp?: any; courseNameProp?: any; type?: string } = {}) => {
  const { courseId } = useParams();
  const courseIdParam = courseId ?? courseIdProp;
  const [courseProgressState, setCourseProgressState] = useAtom(courseProgressAtom);
  const [grades, setGrades] = useState<any>([]);

  const columns = ['Name', 'Status', 'Progress', 'Contribution', 'Quiz Correct', 'Quiz Attempted', 'Grade'];

  const { refetch, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/report/${courseIdParam}`,
    queryKey: ['get-chapters', courseIdParam],
    config: {
      enabled: !!courseIdParam,
      select: (res) => res?.data?.data,
      keepPreviousData: true,
      onSuccess: (res) => {
        const updatedData = res?.map((item: any, index: number, arr: any) => {
          const data = {
            element: item?.title,
            report: item?.chapters?.map((el: any) => {
              const { UserCourseProgress, sections, LastSeenSection, title, QuizAnswer, quizzes } = el || {};

              let chapterProgress = (UserCourseProgress?.length * 100) / sections?.length;
              chapterProgress = isNaN(chapterProgress) ? 0 : chapterProgress;
              let totalSections = arr?.reduce((acc: any, course: any) => {
                const sectionsCount = course.chapters.reduce((acc: any, chapter: any) => {
                  return acc + chapter.sections.length;
                }, 0);
                return acc + sectionsCount;
              }, 0);
              totalSections = isNaN(totalSections) ? '' : totalSections;
              let progressContributionToCourse = (UserCourseProgress?.length * 100) / totalSections;
              progressContributionToCourse = isNaN(progressContributionToCourse)
                ? 0
                : progressContributionToCourse;

              return {
                name: title,
                status:
                  LastSeenSection?.length > 0
                    ? chapterProgress === 100
                      ? 'completed'
                      : 'seen'
                    : 'notOpened',
                progress: chapterProgress,
                quizCorrect: QuizAnswer?.filter((item: any) => item?.isAnswerCorrect)?.length ?? 0,
                totalQuizzes: quizzes?.length,
                progressContributionToCourse: progressContributionToCourse?.toFixed(2),
              };
            }),
          };

          return { ...data };
        });

        const totalProgress = updatedData?.reduce((acc: any, element: any) => {
          const elementProgress = element.report.reduce((elementAcc: any, report: any) => {
            return elementAcc + parseFloat(report.progressContributionToCourse);
          }, 0);
          return acc + elementProgress;
        }, 0);
        setCourseProgressState(totalProgress);

        setGrades(updatedData);
      },
    },
  });
  useEffect(() => {
    if (type === 'grades' && !isLoading) {
      refetch();
    }
  }, [type]);

  return (
    <div>
      <div className="pb-8">
        {/* <div>
          <h2 className="text-2xl font-semibold leading-tight">
            NEBOSH International Diploma in Environmental Management- course report
          </h2>
        </div> */}
        <ReportHeader
          courseProgressState={courseProgressState}
          columns={columns}
          grades={grades}
          courseNameProp={courseNameProp}
        />
        <div className="py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grades?.map((item: any, index: any) => (
                  <React.Fragment key={index}>
                    <tr className="bg-gray-200">
                      <td colSpan={columns.length} className="px-5 py-3 font-semibold text-left">
                        {item.element}
                      </td>
                    </tr>
                    {item.report.map((row: any, rowIndex: any) => (
                      <tr key={rowIndex} className="bg-white">
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{row.name}</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {<StatusComponent status={row?.status} />}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {isNaN(row?.progress) ? 0 : row.progress?.toFixed(2)}%
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {isNaN(row.progressContributionToCourse) ? 0 : row.progressContributionToCourse}%
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {row.quizCorrect}/{row?.totalQuizzes}
                        </td>{' '}
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{'---'}</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{'---'}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;

const ReportHeader = ({ courseProgressState, columns, grades, courseNameProp }: any) => {
  const session = useSession();
  const search = useSearchParams();
  const courseName = search.get('title') ?? courseNameProp;
  const [userPhotoState] = useAtom(userPhotoAtom);

  const userPhoto = 'https://via.placeholder.com/150'; // Placeholder image
  const instituteName = 'Greenwich Training and consulting';
  const instituteAddress = 'I-8/4, Islamabad';
  const today = new Date().toLocaleDateString();

  const getNewDocument = async () => {
    return new Promise((resolve) => {
      resolve(
        <Document>
          <PDFReport
            session={session}
            userPhotoState={userPhotoState}
            courseName={courseName}
            courseProgressState={courseProgressState}
            instituteName={instituteName}
            instituteAddress={instituteAddress}
            today={today}
            columns={columns}
            grades={grades}
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
        console.log({ url });
        setPdfData({
          blob: blob,
          url: url,
        });
      };
      console.log({ session, courseProgressState, grades });
      session && grades && preparePDF();
    } catch (error) {
      console.log({ error });
    }
  }, [session, courseProgressState, grades]);

  return (
    <div className="course-report grid grid-cols-1 md:grid-cols-5 gap-4 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="col-span-2 student-info px-6 py-4 flex flex-col items-center justify-center bg-gray-100">
        <img
          className="w-24 h-24 rounded-full object-cover mb-4"
          src={userPhotoState ?? userPhoto}
          alt="User Photo"
        />
        <h2 className="text-xl font-bold text-gray-800">{`${session.data?.user?.firstName} ${session.data?.user?.lastName}`}</h2>
        <p className="text-gray-600 text-sm">{session.data?.user?.email}</p>
        <p className="text-gray-600 text-sm">{session.data?.user?.phone}</p>
      </div>
      <div className="col-span-3 course-details p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl flex-1 font-bold text-gray-800">{courseName}</h2>
          <div className="flex items-center justify-end gap-2">
            <span className="font-medium text-gray-700">Status:</span>
            <span className="text-gray-800">{courseProgressState === 100 ? 'Completed' : 'In progress'}</span>
          </div>
        </div>
        <div className="progress flex items-center gap-2">
          <span className="font-medium text-gray-700">Progress:</span>
          <span className="text-gray-800">{courseProgressState}%</span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div style={{ width: `${courseProgressState}%` }} className="bg-green-500 rounded-full h-2"></div>
          </div>
        </div>
        <div className="institute-info">
          <p className="text-gray-800">{instituteName}</p>
          <p className="text-gray-800">{instituteAddress}</p>
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

          <div className="date text-gray-500 text-right text-xs">Date: {today}</div>
        </div>
      </div>
      {/* {session && courseProgressState && courseName && grades && (
        <PDFViewer style={{ width: '600px', height: '800px' }}>
          <Document style={{ width: '600px' }}>
            <PDFReport
              session={session}
              courseName={courseName}
              courseProgressState={courseProgressState}
              instituteName={instituteName}
              instituteAddress={instituteAddress}
              today={today}
              columns={columns}
              grades={grades}
            />
          </Document>
        </PDFViewer>
      )} */}
    </div>
  );
};
