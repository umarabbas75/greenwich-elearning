import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ModuleLoader = () => {
  return (
    <>
      <div className="grid grid-cols-6 mb-4 p-2 gap-4 bg-white dark:bg-[#141416] rounded">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Skeleton
            key={index}
            className="h-6"
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        ))}
      </div>
      <div className="p-4 font-sans rounded-xl border dark:border-gray-700 bg-white dark:bg-[#141416]">
        <div className="flex justify-between mb-4">
          <Skeleton
            className="h-6 !w-20"
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
          <Skeleton
            className="h-6 !w-20"
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((_, index) => (
            <Skeleton
              key={index}
              className="h-12"
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ModuleLoader;
