import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TableSkeletonLoader = () => {
  return (
    <div className="border border-gray-200 p-4">
      <div className="w-24 mb-2">
        <Skeleton className="h-10" />
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          {' '}
          <Skeleton className="h-10" />
        </div>
        <div className="flex-1">
          {' '}
          <Skeleton className="h-10" />
        </div>
        <div className="flex-1">
          {' '}
          <Skeleton className="h-10" />
        </div>
        <div className="flex-1">
          {' '}
          <Skeleton className="h-10" />
        </div>
        <div className="flex-1">
          {' '}
          <Skeleton className="h-10" />
        </div>
        <div className="w-12">
          {' '}
          <Skeleton className="h-10" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
  );
};

export default TableSkeletonLoader;
