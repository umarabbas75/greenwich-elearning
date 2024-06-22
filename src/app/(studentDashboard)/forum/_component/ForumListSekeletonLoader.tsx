import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ForumListSkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-8">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="border-2 relative cursor-pointer border-gray-300 dark:border-gray-700 rounded-2xl p-4 shadow-md bg-white dark:bg-gray-800"
        >
          <div className="flex justify-between gap-6">
            <div className="relative rounded-full">
              <Skeleton
                circle={true}
                height={60}
                width={60}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
            </div>

            <div className="flex flex-col gap-0 w-[65%]">
              <p className="text-gray-700 font-semibold text-xl line-clamp-2">
                <Skeleton
                  baseColor="var(--skeleton-base-color)"
                  highlightColor="var(--skeleton-highlight-color)"
                />
              </p>
              <p className="text-gray-500">
                <Skeleton
                  width={100}
                  baseColor="var(--skeleton-base-color)"
                  highlightColor="var(--skeleton-highlight-color)"
                />
                <Skeleton
                  width={150}
                  baseColor="var(--skeleton-base-color)"
                  highlightColor="var(--skeleton-highlight-color)"
                />
              </p>

              <div className="line-clamp-1 text-gray-500 text-sm">
                <Skeleton
                  width="100%"
                  baseColor="var(--skeleton-base-color)"
                  highlightColor="var(--skeleton-highlight-color)"
                />
              </div>
            </div>

            <div className="m-auto">
              <div className="flex gap-0">
                {[...Array(3)].map((_, index) => (
                  <Skeleton
                    key={index}
                    circle={true}
                    height={32}
                    width={32}
                    className={`h-8 w-8 font-normal text-xs shadow-sm border border-white ${
                      index > 0 ? '-ml-2' : ''
                    }`}
                    baseColor="var(--skeleton-base-color)"
                    highlightColor="var(--skeleton-highlight-color)"
                  />
                ))}
                <Skeleton
                  circle={true}
                  height={32}
                  width={32}
                  className="h-8 w-8 font-normal text-xs shadow-sm border bg-white -ml-2 text-gray-700"
                  baseColor="var(--skeleton-base-color)"
                  highlightColor="var(--skeleton-highlight-color)"
                />
              </div>
              <div className="flex items-center justify-between gap-3 mt-2">
                <Skeleton
                  height={20}
                  width={20}
                  baseColor="var(--skeleton-base-color)"
                  highlightColor="var(--skeleton-highlight-color)"
                />
                <Skeleton
                  width={80}
                  baseColor="var(--skeleton-base-color)"
                  highlightColor="var(--skeleton-highlight-color)"
                />
              </div>
            </div>

            <div className="m-auto">
              <Skeleton
                circle={true}
                height={24}
                width={24}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumListSkeletonLoader;
