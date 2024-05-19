'use client';
import { useAtom } from 'jotai';
import { Menu } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQueryClient } from 'react-query';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { lastSelectedSectionAtom, selectedAnswerAtom } from '@/store/course';
import { courseDrawerAtom } from '@/store/modals';
import useWindowWidth from '@/utils/hooks/useWindowWidth';
import { Icons } from '@/utils/icon';

import CourseReport from '../_components/CourseReport';
import CourseSideBarDrawer from '../_components/CourseSideBarDrawer';
import DiscussionForum from '../_components/DiscussionForum';
import Question from '../_components/Question';
import SideBarAllSection from '../_components/SideBarAllSection';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { data: userData } = useSession();
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [courseDrawerState, setCourseDrawerState] = useAtom(courseDrawerAtom);
  const [showCourseReport, setShowCourseReport] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useAtom(selectedAnswerAtom);
  const [lastSelectedSection, setLastSelectedSection] = useAtom(lastSelectedSectionAtom);

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
      select: (data) => {
        return data?.data;
      },
    },
  });
  const selectedItem = sectionsData?.find((item: any) => item?.id === sectionId);
  const lastSection = sectionsData?.[sectionsData?.length - 1];
  const remainingQuestions = sectionsData?.filter((item: any) => item?.question);
  console.log({ sectionsData, remainingQuestions }, remainingQuestions?.length);

  const { data: courseData, isLoading: courseDataLoading } = useApiGet<any, Error>({
    endpoint: `/courses/getAllAssignedCourses/${userData?.user.id}`,
    queryKey: ['get-all-assigned-courses', userData?.user.id],
    config: {
      keepPreviousData: true,
    },
  });

  const { data: allPosts, isLoading: allPostsLoading } = useApiGet<any, Error>({
    endpoint: `/courses/posts/${courseId}`,
    queryKey: ['posts', courseId],
    config: {
      select: (data) => {
        return data?.data?.data;
      },
    },
  });

  const {
    data: lastSeenSection,

    isSuccess: lastSeenSectionSuccess,
  } = useApiGet<any, Error>({
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
          };
          updateLastSeenSection(payload);
          setSelectedSection(firstSection?.id);
        }
      }
    }
  }, [selectedSection, sectionsData, lastSeenSectionSuccess, lastSeenSection]);

  const width = useWindowWidth();

  const renderButtonText = () => {
    if (updatingProgress || checkingQuizAnswer) return 'updating...';
    // if (updatingProgress || checkingQuizAnswer) return 'updating...';
    if (lastSection?.id === selectedItem?.id) return 'End of lesson';
    return 'Next';
  };
  const { mutate: updateProgress, isLoading: updatingProgress } = useApiMutation<any>({
    endpoint: `/courses/updateUserChapter/Progress`,
    method: 'put',
    config: {
      onSuccess: () => {
        try {
          const selectedIndex = sectionsData?.findIndex((item: any) => item.id === sectionId);
          const isLastSection = lastSection?.id === selectedItem?.id;
          if (!isLastSection) {
            const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];
            !selectedItem?.question && setLastSelectedSection(sectionId);
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
            setShowCourseReport(true);
            queryClient.invalidateQueries({
              queryKey: ['get-all-assigned-courses'],
            });

            queryClient.invalidateQueries({
              queryKey: ['get-users-sections-list'],
            });
          }
        } catch (error) {
          console.log({ error });
        }
      },
    },
  });

  const goToNextSection = () => {
    const selectedIndex = sectionsData?.findIndex((item: any) => item.id === sectionId);
    const isLastSection = lastSection?.id === selectedItem?.id;
    if (!isLastSection) {
      const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];
      console.log('setting last section', sectionId);
      !selectedItem?.question && setLastSelectedSection(sectionId);
      setSelectedSection(nextItem?.id);
    } else {
      setShowCourseReport(true);
    }
  };
  console.log('lastSelectedSection 0', lastSelectedSection);

  const { mutate: checkQuizAnswer, isLoading: checkingQuizAnswer } = useApiMutation<any>({
    endpoint: `/quizzes/checkQuiz`,
    method: 'post',
    config: {
      onSuccess: (res) => {
        console.log('lastSelectedSection 1', lastSelectedSection);
        const selectedIndex = sectionsData?.findIndex((item: any) => item.id === lastSelectedSection);
        console.log('lastSelectedSection selectedIndex', selectedIndex);
        const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];
        console.log('lastSelectedSection nextItem', nextItem);
        setSelectedSection(nextItem?.id);
        queryClient.invalidateQueries({
          queryKey: ['get-users-sections-list'],
        });
        console.log('isAnswerCorrect', res?.data?.data?.isAnswerCorrect);
        toast({
          variant: res?.data?.data?.isAnswerCorrect ? 'success' : 'destructive',
          description: res?.data?.data?.isAnswerCorrect
            ? `Congratulations! You've given the correct answer.`
            : `Sorry, that's not the correct answer.`,
        });
      },
      onError: () => {
        // queryClient.invalidateQueries({
        //   queryKey: ['get-users-sections-list'],
        // });
      },
    },
  });
  console.log({ selectedItem });

  const updateCourseProgress = () => {
    if (selectedItem.question) {
      if (!selectedAnswer) {
        return toast({
          variant: 'destructive',
          title: 'Error ',
          description: 'kindly select at least one option',
        });
      }
      setSelectedAnswer('');
      return checkQuizAnswer({
        quizId: selectedItem?.id,
        chapterId: chapterId,
        answer: selectedAnswer,
      });
    }

    const payload = {
      courseId: courseId,
      chapterId: chapterId,
      sectionId: sectionId,
    };
    !selectedItem?.isCompleted ? updateProgress(payload) : goToNextSection();
  };

  return (
    <div className="flex gap-4 min-h-full p-4">
      <>
        {!showDiscussion && (
          <SideBarAllSection
            courseData={courseData}
            courseDataLoading={courseDataLoading}
            chapter={chapter}
            allSections={sectionsData}
            setSelectedSection={setSelectedSection}
            selectedSection={selectedSection}
            isLoading={isLoading}
          />
        )}
        {width < 1024 && courseDrawerState.status && (
          <CourseSideBarDrawer>
            <SideBarAllSection
              courseData={courseData}
              courseDataLoading={courseDataLoading}
              chapter={chapter}
              allSections={sectionsData}
              setSelectedSection={setSelectedSection}
              selectedSection={selectedSection}
              isSidebar={true}
            />
          </CourseSideBarDrawer>
        )}
        <div className="flex-1 p-4 rounded-xl border bg-white h-[95vh] overflow-hidden overflow-y-auto flex flex-col">
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
              {/* <Icons iconName="menu" className="h-6 w-6 cursor-pointer text-accent" /> */}
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
                {chapter?.pdfFile && (
                  <a
                    href={chapter?.pdfFile ?? ''}
                    target="_blank"
                    className="bg-red-800 w-fit text-white pl-1 cursor-pointer flex items-center gap-1 justify-center rounded-sm text-xs px-2 py-1"
                  >
                    <PDFSVG className="w-4 h-4" />
                    DOWNLOAD
                  </a>
                )}
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
            <CourseReport />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mt-4 px-2 md:px-8">
                {isLoading ? (
                  <MainContentLoader />
                ) : selectedItem?.question ? (
                  <Question questionData={selectedItem} />
                ) : (
                  <div>
                    <p className="mb-4">
                      You have earned {chapter?.quizzes?.length - (remainingQuestions?.length ?? 0)} point(s)
                      out of {chapter?.quizzes?.length} point(s) thus far.
                    </p>
                    <div
                      className="text-[15px]"
                      contentEditable="true"
                      dangerouslySetInnerHTML={{ __html: selectedItem?.description }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4 py-4 border-t border-gray-300">
                <Button onClick={() => updateCourseProgress()}>{renderButtonText()}</Button>
              </div>
            </>
          )}

          {/* {isUpdateError && <AlertDestructive error={updateError} />} */}
        </div>
      </>
      {showDiscussion && <DiscussionForum allPosts={allPosts} setShowDiscussion={setShowDiscussion} />}
    </div>
  );
};

export default Page;
const PDFSVG = ({ className }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      version="1.1"
      id="Layer_1"
      viewBox="0 0 303.188 303.188"
      xmlSpace="preserve"
    >
      <g>
        <polygon
          style={{ fill: '#E8E8E8' }}
          points="219.821,0 32.842,0 32.842,303.188 270.346,303.188 270.346,50.525  "
        />
        <path
          style={{ fill: '#FB3449' }}
          d="M230.013,149.935c-3.643-6.493-16.231-8.533-22.006-9.451c-4.552-0.724-9.199-0.94-13.803-0.936   c-3.615-0.024-7.177,0.154-10.693,0.354c-1.296,0.087-2.579,0.199-3.861,0.31c-1.314-1.36-2.584-2.765-3.813-4.202   c-7.82-9.257-14.134-19.755-19.279-30.664c1.366-5.271,2.459-10.772,3.119-16.485c1.205-10.427,1.619-22.31-2.288-32.251   c-1.349-3.431-4.946-7.608-9.096-5.528c-4.771,2.392-6.113,9.169-6.502,13.973c-0.313,3.883-0.094,7.776,0.558,11.594   c0.664,3.844,1.733,7.494,2.897,11.139c1.086,3.342,2.283,6.658,3.588,9.943c-0.828,2.586-1.707,5.127-2.63,7.603   c-2.152,5.643-4.479,11.004-6.717,16.161c-1.18,2.557-2.335,5.06-3.465,7.507c-3.576,7.855-7.458,15.566-11.815,23.02   c-10.163,3.585-19.283,7.741-26.857,12.625c-4.063,2.625-7.652,5.476-10.641,8.603c-2.822,2.952-5.69,6.783-5.941,11.024   c-0.141,2.394,0.807,4.717,2.768,6.137c2.697,2.015,6.271,1.881,9.4,1.225c10.25-2.15,18.121-10.961,24.824-18.387   c4.617-5.115,9.872-11.61,15.369-19.465c0.012-0.018,0.024-0.036,0.037-0.054c9.428-2.923,19.689-5.391,30.579-7.205   c4.975-0.825,10.082-1.5,15.291-1.974c3.663,3.431,7.621,6.555,11.939,9.164c3.363,2.069,6.94,3.816,10.684,5.119   c3.786,1.237,7.595,2.247,11.528,2.886c1.986,0.284,4.017,0.413,6.092,0.335c4.631-0.175,11.278-1.951,11.714-7.57   C231.127,152.765,230.756,151.257,230.013,149.935z M119.144,160.245c-2.169,3.36-4.261,6.382-6.232,9.041   c-4.827,6.568-10.34,14.369-18.322,17.286c-1.516,0.554-3.512,1.126-5.616,1.002c-1.874-0.11-3.722-0.937-3.637-3.065   c0.042-1.114,0.587-2.535,1.423-3.931c0.915-1.531,2.048-2.935,3.275-4.226c2.629-2.762,5.953-5.439,9.777-7.918   c5.865-3.805,12.867-7.23,20.672-10.286C120.035,158.858,119.587,159.564,119.144,160.245z M146.366,75.985   c-0.602-3.514-0.693-7.077-0.323-10.503c0.184-1.713,0.533-3.385,1.038-4.952c0.428-1.33,1.352-4.576,2.826-4.993   c2.43-0.688,3.177,4.529,3.452,6.005c1.566,8.396,0.186,17.733-1.693,25.969c-0.299,1.31-0.632,2.599-0.973,3.883   c-0.582-1.601-1.137-3.207-1.648-4.821C147.945,83.048,146.939,79.482,146.366,75.985z M163.049,142.265   c-9.13,1.48-17.815,3.419-25.979,5.708c0.983-0.275,5.475-8.788,6.477-10.555c4.721-8.315,8.583-17.042,11.358-26.197   c4.9,9.691,10.847,18.962,18.153,27.214c0.673,0.749,1.357,1.489,2.053,2.22C171.017,141.096,166.988,141.633,163.049,142.265z    M224.793,153.959c-0.334,1.805-4.189,2.837-5.988,3.121c-5.316,0.836-10.94,0.167-16.028-1.542   c-3.491-1.172-6.858-2.768-10.057-4.688c-3.18-1.921-6.155-4.181-8.936-6.673c3.429-0.206,6.9-0.341,10.388-0.275   c3.488,0.035,7.003,0.211,10.475,0.664c6.511,0.726,13.807,2.961,18.932,7.186C224.588,152.585,224.91,153.321,224.793,153.959z"
        />
        <polygon style={{ fill: '#FB3449' }} points="227.64,25.263 32.842,25.263 32.842,0 219.821,0  " />
        <g>
          <path
            style={{ fill: '#A4A9AD' }}
            d="M126.841,241.152c0,5.361-1.58,9.501-4.742,12.421c-3.162,2.921-7.652,4.381-13.472,4.381h-3.643    v15.917H92.022v-47.979h16.606c6.06,0,10.611,1.324,13.652,3.971C125.321,232.51,126.841,236.273,126.841,241.152z     M104.985,247.387h2.363c1.947,0,3.495-0.546,4.644-1.641c1.149-1.094,1.723-2.604,1.723-4.529c0-3.238-1.794-4.857-5.382-4.857    h-3.348C104.985,236.36,104.985,247.387,104.985,247.387z"
          />
          <path
            style={{ fill: '#A4A9AD' }}
            d="M175.215,248.864c0,8.007-2.205,14.177-6.613,18.509s-10.606,6.498-18.591,6.498h-15.523v-47.979    h16.606c7.701,0,13.646,1.969,17.836,5.907C173.119,235.737,175.215,241.426,175.215,248.864z M161.76,249.324    c0-4.398-0.87-7.657-2.609-9.78c-1.739-2.122-4.381-3.183-7.926-3.183h-3.773v26.877h2.888c3.939,0,6.826-1.143,8.664-3.43    C160.841,257.523,161.76,254.028,161.76,249.324z"
          />
          <path
            style={{ fill: '#A4A9AD' }}
            d="M196.579,273.871h-12.766v-47.979h28.355v10.403h-15.589v9.156h14.374v10.403h-14.374    L196.579,273.871L196.579,273.871z"
          />
        </g>
        <polygon style={{ fill: '#D1D3D3' }} points="219.821,50.525 270.346,50.525 219.821,0  " />
      </g>
    </svg>
  );
};

const HeaderLoader = () => {
  return (
    <div className="flex justify-between pb-2 border-b border-gray-300">
      <h1 className="text-2xl font-bold ">
        <Skeleton width={300} height={22} />
      </h1>{' '}
      <div className="flex gap-2">
        <h1 className="text-2xl font-bold ">
          <Skeleton width={80} height={22} />
        </h1>
        <h1 className="text-2xl font-bold ">
          <Skeleton width={80} height={22} />
        </h1>
      </div>
    </div>
  );
};

const MainContentLoader = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold ">
        <Skeleton width={'100%'} height={22} />
      </h1>{' '}
      <h1 className="text-2xl font-bold ">
        <Skeleton width={'100%'} height={22} />
      </h1>{' '}
      <h1 className="text-2xl font-bold ">
        <Skeleton width={'100%'} height={22} />
      </h1>{' '}
      <h1 className="text-2xl font-bold ">
        <Skeleton width={'100%'} height={22} />
      </h1>{' '}
      <h1 className="text-2xl font-bold ">
        <Skeleton width={'100%'} height={22} />
      </h1>
    </div>
  );
};
