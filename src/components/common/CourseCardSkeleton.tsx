import React from 'react';
import Skeleton from 'react-loading-skeleton';

const CourseCardSkeleton = () => {
  return (
    <div className="grid md:grid-cols-4 gap-4 mt-4">
      {[1, 2, 3, 4].map((_, index) => (
        <div key={index} className="bg-gray-200 dark:bg-[#141416] rounded-sm p-4 col-span-1">
          <Skeleton
            className="w-64 h-64 mb-3"
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
          <div className="flex justify-between items-center mb-4">
            <Skeleton
              className="!w-20"
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
            <Skeleton
              className="!w-20"
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCardSkeleton;
