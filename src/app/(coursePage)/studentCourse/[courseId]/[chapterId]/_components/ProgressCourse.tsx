'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import ProgressBar from '@/components/common/Progress';

const ProgressCourse = () => {
  const search = useSearchParams();
  const percentage: any = (search as any).get(['coursePercentage']);
  const title: any = (search as any).get(['courseName']);
  return (
    <div className="border rounded-sm bg-white" style={{ boxShadow: '0 0 10px rgba(0,0,0,.1)' }}>
      <div className="bg-primary w-full p-4 flex justify-center items-center rounded-tr-sm rounded-tl-sm">
        <p className="text-white font-bold">Greenwich E-learning</p>
      </div>
      <div className="p-6 pt-4">
        <p className="text-gray-500 text-sm cursor-pointer"> {`< Go back`}</p>
        <h1 className="text-2xl font-bold mt-4">{title}</h1>
        <div className="mt-4">
          <ProgressBar percentage={percentage} className="h-1" />
          <div className="mt-1 flex gap-1 items-center">
            <span className=" font-semibold">{parseInt(percentage)}%</span>
            <span>complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCourse;
