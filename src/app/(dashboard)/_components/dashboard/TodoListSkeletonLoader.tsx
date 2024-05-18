import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TodoListSkeletonLoader = () => {
  return (
    <div className="bg-white flex flex-col rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary">
        <Skeleton width={200} />
      </h2>

      <div className="flex justify-between mb-4">
        <div>
          <Skeleton width={100} height={40} />
        </div>
        <div className="flex items-center">
          <Skeleton width={200} height={40} />
          <Skeleton width={100} height={40} className="ml-4" />
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-lg p-5">
        <div className="flex flex-col gap-4">
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
        </div>
      </div>
    </div>
  );
};

export default TodoListSkeletonLoader;
