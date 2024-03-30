'use client';
import { useAtom } from 'jotai';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';

import { AlertDestructive } from '@/components/common/FormError';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { selectedAnswerAtom, selectedSectionAtom } from '@/store/course';

import ProgressSection from './_components/ProgressSection';
import Question from './_components/Question';
import SideBarAllSection from './_components/SideBarAllSection';
import useGetSectionListData from './utils/useSectionsListContent';

const Page = () => {
  const params = useParams();
  const search = useSearchParams();
  const { courseId, chapterId } = params;
  const queryClient = useQueryClient();
  const chapterName = search.get('chapterName');

  const { sectionsData, isLoading } = useGetSectionListData({ chapterId });

  const [selectedItem, setSelectedItem] = useAtom(selectedSectionAtom);
  const [selectedAnswer] = useAtom(selectedAnswerAtom);

  console.log({ selectedAnswer });

  useEffect(() => {
    return () => {
      setSelectedItem(null);
    };
  }, []);

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
        const nextItem = sectionsData?.[(selectedIndex ?? 0) + 1];
        // updateLastSeenSection();
        setSelectedItem(nextItem);

        queryClient.removeQueries({
          queryKey: ['get-course-progress'],
        });
        queryClient.removeQueries({
          queryKey: ['get-assign-quizzes-answers'],
        });
        queryClient.removeQueries({
          queryKey: ['get-sections-list'],
        });

        toast({
          variant: 'success',
          description: 'Progress saved!',
        });
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
        // updateLastSeenSection();
        setSelectedItem(nextItem);
        queryClient.invalidateQueries({
          queryKey: ['get-course-progress', 'get-assign-quizzes-answers', 'get-course-progress'],
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
  return (
    <div className="flex gap-4 min-h-full p-4">
      {isLoading ? (
        'loading...'
      ) : (
        <>
          <SideBarAllSection allSections={sectionsData} />
          <div className="flex-1 p-4 rounded-xl border bg-white h-[95vh] overflow-hidden overflow-y-auto">
            <div className="flex justify-between pb-4  border-b border-gray-300">
              <p className="text-2xl text-primary">{chapterName}</p>
            </div>

            {selectedItem?.question ? (
              <Question questionData={selectedItem} />
            ) : (
              <div
                className="text-sm"
                contentEditable="true"
                dangerouslySetInnerHTML={{ __html: selectedItem?.description }}
              ></div>
            )}
            <div className="flex justify-between my-4">
              <Button variant="secondary">Prev</Button>
              <Button onClick={() => updateCourseProgress()}>
                {updatingProgress || checkingQuizAnswer ? 'updating...' : 'Next'}
              </Button>
            </div>
            <ProgressSection />

            {isUpdateError && <AlertDestructive error={updateError} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
