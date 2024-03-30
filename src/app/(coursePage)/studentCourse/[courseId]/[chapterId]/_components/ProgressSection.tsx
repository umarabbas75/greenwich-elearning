import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import ProgressBar from '@/components/common/Progress';
import { useApiGet } from '@/lib/dashboard/client/user';

const ProgressSection = () => {
  const { courseId, chapterId } = useParams();
  const { data: userData } = useSession();

  const { data: courseProgress, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/getUserChapterProgress/${userData?.user.id}/${courseId}/${chapterId}`,
    queryKey: ['get-course-progress', courseId, userData?.user.id, chapterId],
  });
  console.log({ courseProgress });
  return (
    <div>
      {isLoading ? (
        'loading'
      ) : (
        <>
          {' '}
          <p>You have completed {courseProgress.data.userCourseProgress}% of the lesson</p>
          <ProgressBar percentage={courseProgress.data.userCourseProgress ?? 0} />
        </>
      )}
    </div>
  );
};

export default ProgressSection;
