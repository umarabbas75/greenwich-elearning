import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TableSkeletonLoader = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
      <div className="w-24 mb-2">
        <Skeleton
          className="h-10"
          baseColor="var(--skeleton-base-color)"
          highlightColor="var(--skeleton-highlight-color)"
        />
      </div>
      <div className="flex gap-4 mb-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex-1">
            <Skeleton
              className="h-10"
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </div>
        ))}
        <div className="w-12">
          <Skeleton
            className="h-10"
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {[...Array(7)].map((_, index) => (
          <Skeleton
            key={index}
            className="h-10"
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        ))}
      </div>
    </div>
  );
};

export default TableSkeletonLoader;
