import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ModuleLoader = () => {
  return (
    <>
      <div className="grid  grid-cols-6 mb-4 p-2 gap-4 bg-white">
        <Skeleton className="h-6" />
        <Skeleton className="h-6" />
        <Skeleton className="h-6" />
        <Skeleton className="h-6" />
        <Skeleton className="h-6" />
        <Skeleton className="h-6" />
      </div>
      <div className="p-4 font-sans  rounded-xl border ">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-6 !w-20" />
          <Skeleton className="h-6 !w-20" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </>
  );
};

export default ModuleLoader;
