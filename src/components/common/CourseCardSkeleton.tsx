import React from 'react';
import Skeleton from 'react-loading-skeleton';

const CourseCardSkeleton = () => {
  return (
    <div className="grid md:grid-cols-4 gap-4 mt-4">
      <div className="bg-gray-200 rounded-sm p-4 col-span-1">
        <Skeleton className="w-64 h-64 mb-3 bg-white" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="!w-20  bg-white" />
          <Skeleton className="!w-20 bg-white  " />
        </div>
      </div>
      <div className="bg-gray-200 rounded-sm p-4 col-span-1">
        <Skeleton className="w-64 h-64 mb-3 bg-white" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="!w-20  bg-white" />
          <Skeleton className="!w-20 bg-white  " />
        </div>
      </div>
      <div className="bg-gray-200 rounded-sm p-4 col-span-1">
        <Skeleton className="w-64 h-64 mb-3 bg-white" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="!w-20  bg-white" />
          <Skeleton className="!w-20 bg-white  " />
        </div>
      </div>
      <div className="bg-gray-200 rounded-sm p-4 col-span-1">
        <Skeleton className="w-64 h-64 mb-3 bg-white" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="!w-20  bg-white" />
          <Skeleton className="!w-20 bg-white  " />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
