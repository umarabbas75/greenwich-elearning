import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ForumPostSkeletonLoader = () => {
  return (
    <div className="pb-20">
      <div className="flex gap-2 items-center my-4">
        <Skeleton
          width={50}
          height={20}
          baseColor="var(--skeleton-base-color)"
          highlightColor="var(--skeleton-highlight-color)"
        />
        <Skeleton
          width={400}
          height={36}
          baseColor="var(--skeleton-base-color)"
          highlightColor="var(--skeleton-highlight-color)"
        />
      </div>

      <div className="p-4 rounded-xl border bg-white dark:bg-[#141416]  mb-4 border-gray-300 dark:border-gray-700">
        <div className="flex gap-2">
          <div className="w-[80px]">
            <Skeleton
              circle={true}
              height={64}
              width={64}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </div>
          <div className="flex-1">
            <Skeleton
              width={200}
              height={24}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
            <p className="flex gap-2 items-center">
              <Skeleton
                width={100}
                height={20}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
              <Skeleton
                width={50}
                height={20}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
              <Skeleton
                width={80}
                height={20}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
            </p>

            <div className="text-[15px]">
              <Skeleton
                count={5}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
            </div>

            <div className="mt-4">
              <Skeleton
                width={100}
                height={20}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
              <hr className="my-4" />
              {[...Array(3)].map((_, index) => (
                <div key={index} className="mb-4">
                  <Skeleton
                    width="100%"
                    height={40}
                    baseColor="var(--skeleton-base-color)"
                    highlightColor="var(--skeleton-highlight-color)"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-white dark:bg-[#141416]  border-gray-300 dark:border-gray-700">
        <div className="flex gap-2 items-start">
          <Skeleton
            circle={true}
            height={64}
            width={64}
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton
              width="100%"
              height={100}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
            <Skeleton
              width={100}
              height={36}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPostSkeletonLoader;
