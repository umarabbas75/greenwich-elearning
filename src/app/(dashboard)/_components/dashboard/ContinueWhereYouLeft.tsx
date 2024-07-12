import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApiGet } from '@/lib/dashboard/client/user';

const ContinueWhereYouLeft = () => {
  const { data: userData } = useSession();

  const { data, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/getAllAssignedCourses/${userData?.user.id}`,
    queryKey: ['get-all-assigned-courses', userData?.user.id],
    config: {
      select: (res) => res?.data?.data,
      keepPreviousData: true,
    },
  });
  console.log({ isLoading });
  if (isLoading) {
    return <SkeletonLoader />;
  }
  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.length > 0
        ? data?.map((item: any, index: any) => {
            if (item?.latestLastSeenSection?.title) {
              return (
                <div
                  key={index}
                  className="col-span-3 md:col-span-1  bg-white dark:bg-black dark:border dark:border-white rounded-lg shadow-md px-4 py-5"
                >
                  <div className="course-info flex items-center">
                    <img className="w-20 h-20 rounded-full mr-4" src={item?.image} alt="Course Thumbnail" />
                    <div className="course-details">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white/80 line-clamp-2">
                        {item?.title}
                      </h3>
                      <p className="text-gray-600  text-sm line-clamp-2 dark:text-white/70">
                        {item?.latestLastSeenSection?.title}
                      </p>
                    </div>
                  </div>

                  <div className="my-2">
                    <Progress value={item?.percentage} className="h-2" />
                  </div>
                  <small className="mb-2 block">Continue where you left off.</small>

                  <Link
                    href={{
                      pathname: `/studentNewCourse/${item?.id}/${item?.latestLastSeenSection?.chapterId}/${item?.latestLastSeenSection?.moduleId}/${item?.latestLastSeenSection?.sectionId}`,
                    }}
                  >
                    <Button>Resume</Button>
                  </Link>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="col-span-3 md:col-span-1  bg-white rounded-lg shadow-md px-4 py-5"
                >
                  <div className="course-info flex items-center">
                    <img className="w-20 h-20 rounded-full mr-4" src={item?.image} alt="Course Thumbnail" />
                    <div className="course-details">
                      <h3 className="text-xl font-medium text-gray-800 line-clamp-2">{item?.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{item?.latestLastSeenSection?.title}</p>
                    </div>
                  </div>

                  <div className="my-2">
                    <Progress value={item?.percentage} className="h-2" />
                  </div>

                  <small className="mb-2 block">You have not started this course yet.</small>
                  <Link
                    href={{
                      pathname: `/studentCourses/${item?.id}`,
                      query: { title: item.title },
                    }}
                  >
                    <Button>{`Let's start`}</Button>
                  </Link>
                </div>
              );
            }
          })
        : 'Oops!, looks like there is no course assigned to you by admin'}
    </div>
  );
};

export default ContinueWhereYouLeft;
const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="col-span-3 md:col-span-1 bg-white dark:bg-[#141416] rounded-lg shadow-md px-4 py-5"
        >
          <div className="course-info flex items-center">
            <div
              className="w-20 h-20 rounded-full bg-gray-300 mr-4 animate-pulse"
              style={{ backgroundColor: 'var(--skeleton-base-color)' }}
            ></div>
            <div className="course-details flex-1">
              <div
                className="h-6 bg-gray-300 rounded w-3/4 animate-pulse mb-2"
                style={{ backgroundColor: 'var(--skeleton-base-color)' }}
              ></div>
              <div
                className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"
                style={{ backgroundColor: 'var(--skeleton-base-color)' }}
              ></div>
            </div>
          </div>
          <div className="my-2">
            <div
              className="h-2 bg-gray-300 rounded w-full animate-pulse"
              style={{ backgroundColor: 'var(--skeleton-base-color)' }}
            ></div>
          </div>
          <small
            className="block h-4 bg-gray-300 rounded w-1/2 animate-pulse mb-2"
            style={{ backgroundColor: 'var(--skeleton-base-color)' }}
          ></small>
          <div
            className="h-10 bg-gray-300 rounded w-1/3 animate-pulse"
            style={{ backgroundColor: 'var(--skeleton-base-color)' }}
          ></div>
        </div>
      ))}
    </div>
  );
};
