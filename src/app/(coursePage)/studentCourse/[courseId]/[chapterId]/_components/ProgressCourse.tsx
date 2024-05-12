'use client';
import { useSetAtom } from 'jotai';
import { ArrowLeft, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import ProgressBar from '@/components/common/Progress';
import { useApiGet } from '@/lib/dashboard/client/user';
import { courseDrawerAtom } from '@/store/modals';

const ProgressCourse = () => {
  const setCourseDrawerState = useSetAtom(courseDrawerAtom);

  const { courseId } = useParams();
  const router = useRouter();
  const { data: userData } = useSession();
  const [courseData, setCourseData] = useState<any>({});

  useApiGet<any, Error>({
    endpoint: `/courses/getAllAssignedCourses/${userData?.user.id}`,
    queryKey: ['get-all-assigned-courses', userData?.user.id],
    config: {
      onSuccess: (res) => {
        console.log('invalid2');
        const data = res.data.find((item: any) => item.id === courseId);
        setCourseData(data);
      },
    },
  });

  return (
    <div className="border rounded-sm bg-white" style={{ boxShadow: '0 0 10px rgba(0,0,0,.1)' }}>
      <div className="bg-primary w-full p-4 hidden md:flex justify-center items-center rounded-tr-sm rounded-tl-sm">
        <p className="text-white font-bold">Greenwich E-learning</p>
      </div>
      <div className="p-6 pt-4">
        <div className="flex justify-between">
          <p
            className="text-gray-500 flex gap-1 text-sm cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft />
            Back
          </p>
          <X
            className="h-4 w-4 cursor-pointer"
            onClick={() => {
              setCourseDrawerState({
                data: null,
                status: false,
              });
            }}
          />
        </div>

        <h1 className="text-2xl font-bold mt-4">{courseData?.title}</h1>
        <div className="mt-4">
          <ProgressBar percentage={parseInt(courseData?.percentage)} className="h-1" />
          <div className="mt-1 flex gap-1 items-center">
            Course is
            <span className=" font-semibold">{parseInt(courseData?.percentage ?? 0).toFixed(0)}%</span>
            <span>complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCourse;
