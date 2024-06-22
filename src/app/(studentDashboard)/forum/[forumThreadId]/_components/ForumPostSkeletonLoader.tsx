import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ForumPostSkeletonLoader = () => {
  return (
    <div className="pb-20">
      <div className="flex gap-2 items-center my-4">
        <Skeleton width={50} height={20} />
        <Skeleton width={200} height={36} />
      </div>

      <div className="p-4 rounded-xl border bg-white mb-4">
        <div className="flex gap-2">
          <div className="w-[80px]">
            <Skeleton circle={true} height={64} width={64} />
          </div>
          <div className="flex-1">
            <Skeleton width={200} height={24} />
            <p className="flex gap-2 items-center">
              <Skeleton width={100} height={20} />
              <Skeleton width={50} height={20} />
              <Skeleton width={80} height={20} />
            </p>

            <div className="text-[15px]">
              <Skeleton count={5} />
            </div>

            <div className="mt-4">
              <Skeleton width={100} height={20} />
              <hr className="my-4" />
              {[...Array(3)].map((_, index) => (
                <div key={index} className="mb-4">
                  <Skeleton width="100%" height={40} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-white">
        <div className="flex gap-2 items-start">
          <Skeleton circle={true} height={64} width={64} />
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton width="100%" height={100} />
            <Skeleton width={100} height={36} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPostSkeletonLoader;
