import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { useApiGet } from '@/lib/dashboard/client/user';

const ProgressSection = () => {
  const { courseId } = useParams();
  const { data: userData } = useSession();

  const { data: courseProgress, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/getUserCourseProgress/${userData?.user.id}/${courseId}`,
    queryKey: ['get-course-progress', courseId, userData?.user.id],
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

const ProgressBar = ({ percentage }: any) => {
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
      <div
        className="h-full bg-orange-500 text-white font-bold text-center absolute left-0"
        style={{ width: `${normalizedPercentage}%` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">{`${normalizedPercentage}%`}</div>
      </div>
    </div>
  );
};
