import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ForumListSkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-8">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="border-2 relative cursor-pointer border-gray-300 rounded-2xl p-4 shadow-md bg-white"
        >
          <div className="flex justify-between gap-6">
            <div className="relative rounded-full">
              <Skeleton circle={true} height={60} width={60} />
              {/* <div className="bg-orange-500 absolute right-0 top-2 z-10 p-1 rounded-full">
                <Skeleton circle={true} height={20} width={20} />
              </div> */}
            </div>

            <div className="flex flex-col gap-0 w-[65%]">
              <p className="text-gray-700 font-semibold text-xl line-clamp-2">
                <Skeleton />
              </p>
              <p className="text-gray-500">
                <Skeleton width={100} />
                <Skeleton width={150} />
              </p>

              <div className="line-clamp-1 text-gray-500 text-sm">
                <Skeleton width="100%" />
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
                  />
                ))}
                <Skeleton
                  circle={true}
                  height={32}
                  width={32}
                  className="h-8 w-8 font-normal text-xs shadow-sm border bg-white -ml-2 text-gray-700"
                />
              </div>
              <div className="flex items-center justify-between gap-3 mt-2">
                <Skeleton height={20} width={20} />
                <Skeleton width={80} />
              </div>
            </div>

            <div className="m-auto">
              <Skeleton circle={true} height={24} width={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumListSkeletonLoader;
