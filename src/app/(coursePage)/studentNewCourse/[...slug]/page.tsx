'use client';
import { useAtom } from 'jotai';
import { Menu } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { useQueryClient } from 'react-query';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { courseDrawerAtom } from '@/store/modals';
import useWindowWidth from '@/utils/hooks/useWindowWidth';
import { Icons } from '@/utils/icon';

import CourseReport from '../_components/CourseReport';
import CourseSideBarDrawer from '../_components/CourseSideBarDrawer';
import DiscussionForum from '../_components/DiscussionForum';
import SideBarAllSection from '../_components/SideBarAllSection';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { data: userData } = useSession();
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [courseDrawerState, setCourseDrawerState] = useAtom(courseDrawerAtom);
  const [showCourseReport, setShowCourseReport] = useState(false);

  const courseId = params.slug?.[0] || '';
  const chapterId = params.slug?.[1] || '';
  const moduleId = params.slug?.[2] || '';
  const sectionId = params.slug?.[3] || '';
  const queryClient = useQueryClient();

  const [selectedSection, setSelectedSection] = useState(sectionId);

  const { data: { data: sectionsData, chapter } = {}, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/user/module/chapter/allSections/${chapterId}/${courseId}`,
    queryKey: ['get-users-sections-list', chapterId],
    config: {
      keepPreviousData: true,
      select: (data: any) => {
        return data?.data;
      },
    },
  });

  const containQuizzes = chapter?.quizzes?.length > 0 ? true : false;

  const selectedItem = sectionsData?.find((item: any) => item?.id === sectionId);
  const lastSection = sectionsData?.[sectionsData?.length - 1];

  const { data: allPosts, isLoading: allPostsLoading } = useApiGet<any, Error>({
    endpoint: `/courses/posts/${courseId}`,
    queryKey: ['posts', courseId],
    config: {
      select: (data: any) => {
        return data?.data?.data;
      },
    },
  });

  const { data: lastSeenSection, isSuccess: lastSeenSectionSuccess } = useApiGet<any, Error>({
    endpoint: `/courses/section/getLastSeen/${userData?.user.id}/${chapterId}`,
    queryKey: ['last-seen-section', userData?.user.id, chapterId],
    config: {
      select: (res) => res?.data?.data,
    },
  });
  const { mutate: updateLastSeenSection } = useApiMutation<any>({
    endpoint: `/courses/section/updateLastSeen/`,
    method: 'post',
  });

  useEffect(() => {
    if (lastSeenSectionSuccess) {
      if (selectedSection) {
        router.replace(`/studentNewCourse/${courseId}/${chapterId}/${moduleId}/${selectedSection}`);
      } else {
        if (lastSeenSection?.sectionId) {
          setSelectedSection(lastSeenSection?.sectionId);
        } else {
          const firstSection = sectionsData?.[0];
          const payload = {
            chapterId: chapterId,
            sectionId: firstSection?.id,
            moduleId,
            courseId,
          };
          updateLastSeenSection(payload);
          setSelectedSection(firstSection?.id);
        }
      }
    }
  }, [selectedSection, sectionsData, lastSeenSectionSuccess, lastSeenSection]);

  const width = useWindowWidth();

  const renderButtonText = () => {
    if (updatingProgress) return 'Saving progress...';
    return 'Next';
  };

  const { mutate: createQuizReport } = useApiMutation<any>({
    endpoint: `/quizzes/createChapterQuizzesReport`,
    method: 'post',
  });

  const markThisElementsQuizzesAsCompleted = () => {
    if (chapter?.quizzes?.length === 0) {
      const payload = {
        chapterId,
        totalAttempts: 1,
        isPassed: true,
        score: 100,
      };

      createQuizReport(payload);
    }
  };

  const { mutate: updateProgress, isLoading: updatingProgress } = useApiMutation<any>({
    endpoint: `/courses/updateUserChapter/Progress`,
    method: 'put',
    config: {
      onSuccess: () => {
        const selectedIndex = sectionsData?.findIndex((item: any) => item.id === sectionId);
        const isLastSection = lastSection?.id === selectedItem?.id;
        if (!isLastSection) {
          const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];

          const payload1 = {
            chapterId: chapterId,
            sectionId: nextItem?.id,
            moduleId,
            courseId,
          };
          updateLastSeenSection(payload1);
          setSelectedSection(nextItem?.id);

          queryClient.invalidateQueries({
            queryKey: ['get-all-assigned-courses'],
          });

          queryClient.invalidateQueries({
            queryKey: ['get-users-sections-list'],
          });

          toast({
            variant: 'success',
            description: 'Progress saved!',
          });
        } else {
          // if there are no quizzes assigned to any element, then when user click the next button for the last section, we will have to
          // mark that section quizzes as passed automatically
          markThisElementsQuizzesAsCompleted();

          ///////////////////////////

          setShowCourseReport(true);

          queryClient.invalidateQueries({
            queryKey: ['get-all-assigned-courses'],
          });

          queryClient.invalidateQueries({
            queryKey: ['get-users-sections-list'],
          });
        }
      },
      keepPreviousData: true,
    },
  });

  const goToNextSection = () => {
    const selectedIndex = sectionsData?.findIndex((item: any) => item.id === sectionId);
    const isLastSection = lastSection?.id === selectedItem?.id;
    if (!isLastSection) {
      const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];

      const payload1 = {
        chapterId: chapterId,
        sectionId: nextItem?.id,
        moduleId,
        courseId,
      };
      updateLastSeenSection(payload1);
      setSelectedSection(nextItem?.id);
    } else {
      // if there are no quizzes assigned to any element, then when user click the next button for the last section, we will have to
      // mark that section quizzes as passed automatically
      markThisElementsQuizzesAsCompleted();

      ///////////////////////////

      setShowCourseReport(true);
      setShowCourseReport(true);
    }
  };

  const updateCourseProgress = () => {
    const payload = {
      courseId: courseId,
      chapterId: chapterId,
      sectionId: sectionId,
      moduleId: moduleId,
    };

    !selectedItem?.isCompleted ? updateProgress(payload) : goToNextSection();
  };
  // Mapping of file extensions to icons
  const fileIcons = {
    pdf: <FaFilePdf className="w-4 h-4" />,
    doc: <FaFileWord className="w-4 h-4" />,
    docx: <FaFileWord className="w-4 h-4" />,
    xls: <FaFileExcel className="w-4 h-4" />,
    xlsx: <FaFileExcel className="w-4 h-4" />,
    txt: <FaFileAlt className="w-4 h-4" />,
    // Add more mappings as needed
  };

  // Function to extract file extension from URL
  const getFileExtension = (url: string) => {
    if (!url) return '';
    return url?.split('.')?.pop()?.toLowerCase();
  };

  // Component to render the download link with the appropriate icon
  const DownloadLink = ({ fileUrl }: any) => {
    const fileExtension = getFileExtension(fileUrl) as keyof typeof fileIcons;
    const icon = fileExtension ? fileIcons[fileExtension] || <FaFileAlt className="w-4 h-4" /> : ''; // Default icon for unknown file types

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-red-800 w-fit text-white pl-1 cursor-pointer flex items-center gap-1 justify-center rounded-sm text-xs px-2 py-1"
      >
        {icon}
        DOWNLOAD
      </a>
    );
  };

  return (
    <div className="flex gap-4 min-h-full p-4">
      <>
        {!showDiscussion && (
          <SideBarAllSection
            chapter={chapter}
            allSections={sectionsData}
            selectedSection={selectedSection}
            isLoading={isLoading}
            setSelectedSection={setSelectedSection}
          />
        )}
        {width < 1024 && courseDrawerState.status && (
          <CourseSideBarDrawer>
            <SideBarAllSection
              chapter={chapter}
              allSections={sectionsData}
              selectedSection={selectedSection}
              isSidebar={true}
              setSelectedSection={setSelectedSection}
            />
          </CourseSideBarDrawer>
        )}
        <div className="flex-1 p-4 rounded-xl border bg-white dark:bg-black h-[95vh] overflow-hidden overflow-y-auto flex flex-col">
          <div className="bg-primary w-full p-4 flex lg:hidden justify-between items-center rounded-sm rounded-tl-sm mb-2">
            <div
              onClick={() => {
                setCourseDrawerState({
                  data: null,
                  status: !courseDrawerState.status,
                });
              }}
              className="dark-icon border rounded visible lg:invisible  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary"
            >
              <Menu className="text-white" />
            </div>
            <p className="text-white font-bold">Greenwich E-learning</p>
            <p></p>
          </div>
          {allPostsLoading || isLoading ? (
            <HeaderLoader />
          ) : (
            <div className="flex flex-col md:flex-row justify-between pb-4  border-b border-gray-300 items-center">
              <p className="mb-2 md:mb-0 text-sm sm:text-base lg:text-xl text-primary max-w-[70%] font-roboto">
                {chapter?.title}
              </p>
              <div className="flex gap-1">
                {chapter?.pdfFile && <DownloadLink fileUrl={chapter?.pdfFile ?? ''} />}
                <button
                  onClick={() => {
                    setShowDiscussion(!showDiscussion);
                  }}
                  className="bg-[#36394D] text-white pl-1 flex items-center gap-1 justify-center rounded-sm text-xs px-2 py-1"
                >
                  <Icons iconName="discussion" className="h-4 w-4" />
                  {allPosts?.length} DISCUSSIONS
                </button>
              </div>
            </div>
          )}

          {showCourseReport ? (
            <CourseReport setShowCourseReport={setShowCourseReport} containQuizzes={containQuizzes} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mt-4 px-2 md:px-8">
                {isLoading ? (
                  <MainContentLoader />
                ) : (
                  <div>
                    <div
                      className="text-[15px]"
                      contentEditable="false"
                      dangerouslySetInnerHTML={{ __html: selectedItem?.description }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4 py-4 border-t border-gray-300">
                <Button
                  disabled={updatingProgress}
                  onClick={() => !updatingProgress && updateCourseProgress()}
                >
                  {renderButtonText()}
                </Button>

                {/* {lastSection?.id === selectedItem?.id && <StartQuiz />} */}
              </div>
            </>
          )}
        </div>
      </>
      {showDiscussion && <DiscussionForum allPosts={allPosts} setShowDiscussion={setShowDiscussion} />}
    </div>
  );
};

export default Page;

const HeaderLoader = () => {
  return (
    <div className="flex justify-between pb-2 border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-2xl font-bold">
        <Skeleton
          width={300}
          height={22}
          baseColor="var(--skeleton-base-color)"
          highlightColor="var(--skeleton-highlight-color)"
        />
      </h1>
      <div className="flex gap-2">
        <h1 className="text-2xl font-bold">
          <Skeleton
            width={80}
            height={22}
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        </h1>
        <h1 className="text-2xl font-bold">
          <Skeleton
            width={80}
            height={22}
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        </h1>
      </div>
    </div>
  );
};

const MainContentLoader = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(5)].map((_, index) => (
        <h1 key={index} className="text-2xl font-bold">
          <Skeleton
            width="100%"
            height={22}
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        </h1>
      ))}
    </div>
  );
};
