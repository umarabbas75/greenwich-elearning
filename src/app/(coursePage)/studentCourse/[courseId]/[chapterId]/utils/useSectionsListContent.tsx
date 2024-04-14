import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useApiGet } from '@/lib/dashboard/client/user';
import { selectedSectionAtom } from '@/store/course';

const useGetSectionListData = ({ chapterId }: any) => {
  const [_, setSelectedItem] = useAtom(selectedSectionAtom);
  console.log({ setSelectedItem });
  const [mergedData, setMergedData] = useState<any>([]);
  const { data: userData } = useSession();
  const { courseId } = useParams();
  const {
    data: lastSeenSection,
    isLoading: lastSeenSectionLoading,
    isSuccess: lastSeenSectionSuccess,
  } = useApiGet<any, Error>({
    endpoint: `/courses/section/getLastSeen/${userData?.user.id}/${chapterId}`,
    queryKey: ['last-seen-section', userData?.user.id, chapterId],
  });

  const {
    data: quizAnswersList,
    isLoading: quizAnswersListLoading,
    isSuccess: quizAnswersListSuccess,
  } = useApiGet<any, Error>({
    endpoint: `/quizzes/user/getQuizAnswers/${chapterId}`,
    queryKey: ['get-assign-quizzes-answers', chapterId],
  });

  const {
    data: allSectionsList,
    isLoading: allSectionsListLoading,
    isSuccess: allSectionsListSuccess,
  } = useApiGet<any, Error>({
    endpoint: `/courses/module/chapter/allSections/${chapterId}`,
    queryKey: ['get-sections-list', chapterId],
  });

  const {
    data: assignedQuizzesList,
    isLoading: assignedQuizzesListLoading,
    isSuccess: assignedQuizzesListSuccess,
  } = useApiGet<any, Error>({
    endpoint: `/quizzes/getAllAssignQuizzes/${chapterId}`,
    queryKey: ['get-assign-quizzes-list', chapterId],
  });

  const {
    data: courseProgressData,
    isLoading: courseProgressLoading,
    isSuccess: courseProgressSuccess,
  } = useApiGet<any, Error>({
    endpoint: `/courses/getUserChapterProgress/${userData?.user.id}/${courseId}/${chapterId}`,
    queryKey: ['get-course-progress', courseId, userData?.user.id, chapterId],
  });
  console.log({
    quizAnswersList,
  });

  useEffect(() => {
    if (
      quizAnswersListSuccess &&
      allSectionsListSuccess &&
      assignedQuizzesListSuccess &&
      courseProgressSuccess
    ) {
      const allSections = allSectionsList?.data;
      const completedSections = courseProgressData?.data?.courseProgressData;
      console.log({ lastSeenSection });

      if (!lastSeenSection.data) {
        const firstSection = allSections?.[0];
        setSelectedItem(firstSection);
      } else if (lastSeenSection.data.id) {
        const lastItem = allSections.find((item: any) => item.id === lastSeenSection.data.sectionId);
        console.log({ lastItem });
        setSelectedItem(lastItem);
      }

      allSections.forEach((section: any) => {
        // Check if the section ID exists in completedSections
        const isCompleted = completedSections?.some(
          (completedSection: any) => completedSection.sectionId === section.id,
        );
        // Insert the boolean value into the section object
        section.isCompleted = isCompleted;
      });
      const filteredQuizzes = assignedQuizzesList?.data?.filter((quiz: any) => !quiz.isCorrect);
      const shuffledQuizzes = shuffle(filteredQuizzes);
      const mergedArray = insertQuizzes(allSections, shuffledQuizzes);
      setMergedData([...mergedArray]);
    }
  }, [
    quizAnswersListSuccess,
    allSectionsListSuccess,
    assignedQuizzesListSuccess,
    courseProgressSuccess,
    lastSeenSectionSuccess,
  ]);

  console.log({ mergedData });

  return {
    sectionsData: mergedData,
    isLoading:
      allSectionsListLoading ||
      quizAnswersListLoading ||
      courseProgressLoading ||
      assignedQuizzesListLoading ||
      lastSeenSectionLoading,
  };
};

export default useGetSectionListData;

const shuffle = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
function insertQuizzes(sections: any, quizzes: any) {
  // Remove first and last indexes for quiz placement
  const availableIndexes = [];
  if (sections.length > 2) {
    for (let i = 1; i < sections.length - 1; i++) {
      availableIndexes.push(i);
    }
  }

  // Shuffle quizzes to randomize placement
  const shuffledQuizzes = quizzes.sort(() => Math.random() - 0.5);

  // Insert quizzes into available indexes
  for (let i = 0; i < shuffledQuizzes.length; i++) {
    const randomIndex = availableIndexes.splice(Math.floor(Math.random() * availableIndexes.length), 1)[0];
    sections.splice(randomIndex, 0, shuffledQuizzes[i]);
  }

  return sections;
}
