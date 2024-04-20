'use client';
import { useAtom } from 'jotai';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

import { AlertDestructive } from '@/components/common/FormError';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { selectedAnswerAtom, selectedSectionAtom } from '@/store/course';
import { Icons } from '@/utils/icon';

import CourseReport from './_components/CourseReport';
import DiscussionForum from './_components/DiscussionForum';
import Question from './_components/Question';
import SideBarAllSection from './_components/SideBarAllSection';

const Page = () => {
  const params = useParams();
  const search = useSearchParams();
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showCourseReport, setShowCourseReport] = useState(false);
  const { courseId, chapterId } = params;
  const queryClient = useQueryClient();
  const chapterName = search.get('chapterName');

  const { data: userData } = useSession();
  console.log({ courseId });

  // const { sectionsData, isLoading } = useGetSectionListData({ chapterId });

  const {
    data: sectionsData,
    isLoading,
    isSuccess: allSectionsListSuccess,
  } = useApiGet<any, Error>({
    endpoint: `/courses/user/module/chapter/allSections/${chapterId}/${courseId}`,
    queryKey: ['get-users-sections-list', chapterId],
    config: {
      select: (data) => {
        return data?.data?.data;
      },
    },
  });

  const { data: allPosts, isLoading: postsLoading } = useApiGet<any, Error>({
    endpoint: `/courses/posts/${courseId}`,
    queryKey: ['posts', courseId],
    config: {
      select: (data) => {
        return data?.data?.data;
      },
    },
  });
  console.log({ allPosts, postsLoading });

  const {
    data: lastSeenSection,
    isLoading: lastSeenSectionLoading,
    isSuccess: lastSeenSectionSuccess,
  } = useApiGet<any, Error>({
    endpoint: `/courses/section/getLastSeen/${userData?.user.id}/${chapterId}`,
    queryKey: ['last-seen-section', userData?.user.id, chapterId],
  });
  console.log({ lastSeenSectionLoading });

  useEffect(() => {
    if (allSectionsListSuccess && lastSeenSectionSuccess) {
      console.log('testtt log', { lastSeenSection, sectionsData });
      if (!lastSeenSection?.data?.id) {
        const firstSection = sectionsData?.[0];
        setSelectedItem(firstSection);
      } else if (lastSeenSection.data.id) {
        const lastItem = sectionsData?.find((item: any) => item.id === lastSeenSection.data.sectionId);
        console.log({ lastItem });
        setSelectedItem(lastItem);
      }
    }
  }, [allSectionsListSuccess, lastSeenSectionSuccess]);

  const [selectedItem, setSelectedItem] = useAtom(selectedSectionAtom);
  const [selectedAnswer] = useAtom(selectedAnswerAtom);

  const lastSection = sectionsData?.[sectionsData?.length - 1];

  console.log({ selectedItem, isLoading });
  const {
    mutate: updateLastSeenSection,
    //isLoading: editingCourse,
  } = useApiMutation<any>({
    endpoint: `/courses/section/updateLastSeen/`,
    method: 'post',
  });

  console.log({ selectedAnswer });

  useEffect(() => {
    return () => {
      setSelectedItem(null);
    };
  }, []);

  useEffect(() => {
    if (selectedItem?.id && chapterId) {
      const payload = {
        chapterId: chapterId,
        sectionId: selectedItem?.id,
      };
      updateLastSeenSection(payload);
    }
  }, [selectedItem, chapterId]);

  const {
    mutate: updateProgress,
    isLoading: updatingProgress,
    isError: isUpdateError,
    error: updateError,
  } = useApiMutation<any>({
    endpoint: `/courses/updateUserChapter/Progress`,
    method: 'put',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });
        const selectedIndex = sectionsData?.findIndex((item: any) => item.id === selectedItem?.id);
        const isLastSection = lastSection?.id === selectedItem?.id;
        console.log({ isLastSection });
        if (!isLastSection) {
          const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];
          setSelectedItem(nextItem);

          queryClient.invalidateQueries({
            queryKey: ['get-course-progress'],
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
        }
      },
    },
  });

  const {
    mutate: checkQuizAnswer,
    isLoading: checkingQuizAnswer,
    isError: isCheckQuizError,
    error: checkQuizError,
  } = useApiMutation<any>({
    endpoint: `/quizzes/checkQuiz`,
    method: 'post',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });
        const selectedIndex = sectionsData?.findIndex((item: any) => item.id === selectedItem?.id);
        const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];
        setSelectedItem(nextItem);
        queryClient.invalidateQueries({
          queryKey: ['get-users-sections-list'],
        });

        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Progress saved!',
        });
      },
    },
  });
  console.log({ sectionsData, selectedItem, isCheckQuizError, checkQuizError });

  const updateCourseProgress = () => {
    if (selectedItem.question) {
      if (!selectedAnswer) {
        return toast({
          variant: 'destructive',
          title: 'Error ',
          description: 'kindly select at least one option',
        });
      }
      return checkQuizAnswer({
        quizId: selectedItem?.id,
        chapterId: chapterId,
        answer: selectedAnswer,
      });
    }

    const payload = {
      // userId: userData?.user.id,
      courseId: courseId,
      chapterId: chapterId,
      sectionId: selectedItem?.id,
    };
    updateProgress(payload);
  };
  const renderButtonText = () => {
    if (updatingProgress || checkingQuizAnswer) return 'updating...';
    if (lastSection?.id === selectedItem?.id) return 'End of lesson';
    else return 'Save and continue';
  };

  return (
    <div className="flex gap-4 min-h-full p-4">
      <>
        {!showDiscussion && <SideBarAllSection allSections={sectionsData} />}
        <div className="flex-1 p-4 rounded-xl border bg-white h-[95vh] overflow-hidden overflow-y-auto flex flex-col">
          <div className="flex justify-between pb-4  border-b border-gray-300 items-center">
            <p className="text-xl text-primary max-w-[70%] font-roboto">{chapterName}</p>
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

          {showCourseReport ? (
            <CourseReport />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mt-4 px-8">
                {isLoading ? (
                  'loading....'
                ) : selectedItem?.question ? (
                  <Question questionData={selectedItem} />
                ) : (
                  <div
                    className="text-[15px]"
                    contentEditable="true"
                    dangerouslySetInnerHTML={{ __html: selectedItem?.description }}
                  ></div>
                )}
              </div>

              <div className="flex justify-center gap-4 py-4 border-t border-gray-300">
                <Button variant="secondary">Prev</Button>
                <Button onClick={() => updateCourseProgress()}>{renderButtonText()}</Button>
              </div>
            </>
          )}

          {isUpdateError && <AlertDestructive error={updateError} />}
        </div>
        {showDiscussion && <DiscussionForum allPosts={allPosts} setShowDiscussion={setShowDiscussion} />}
      </>
    </div>
  );
};

export default Page;
