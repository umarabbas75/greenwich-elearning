'use client';
import { useSetAtom } from 'jotai';
import { ArrowLeft, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useApiGet } from '@/lib/dashboard/client/user';
import { courseDrawerAtom } from '@/store/modals';

const ProgressCourse = () => {
  const setCourseDrawerState = useSetAtom(courseDrawerAtom);
  const params = useParams();
  const courseId = params.slug?.[0] || '';

  const { data: course, isLoading: courseDataLoading } = useApiGet<any, Error>({
    endpoint: `/courses/${courseId}`,
    queryKey: ['course-detail', courseId],
    config: {
      keepPreviousData: true,
      select: (res) => res?.data?.data,
    },
  });

  const router = useRouter();

  if (courseDataLoading) {
    return (
      <div
        className="border rounded-sm bg-white dark:bg-gray-800"
        style={{ boxShadow: '0 0 10px rgba(0,0,0,.1)' }}
      >
        <div className="bg-primary w-full p-4 hidden md:flex justify-center items-center rounded-tr-sm rounded-tl-sm">
          <Skeleton
            height={24}
            width={150}
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />
        </div>
        <div className="p-6 pt-4">
          <div className="flex justify-between">
            <Skeleton
              width={80}
              height={20}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
            <Skeleton
              width={20}
              height={20}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </div>
          <h1 className="text-2xl font-bold mt-4">
            <Skeleton
              width={300}
              height={22}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </h1>
          <div className="mt-4">
            <Skeleton
              width="100%"
              height={4}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
            <div className="mt-1 flex gap-1 items-center">
              <Skeleton
                width={100}
                height={16}
                baseColor="var(--skeleton-base-color)"
                highlightColor="var(--skeleton-highlight-color)"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="border rounded-sm bg-white dark:bg-black"
      style={{ boxShadow: '0 0 10px rgba(0,0,0,.1)' }}
    >
      <div className="bg-primary w-full p-4 hidden md:flex justify-center items-center rounded-tr-sm rounded-tl-sm">
        <p className="text-white font-bold">Greenwich E-learning</p>
      </div>
      <div className="p-6 pt-4">
        <div className="flex justify-between">
          <p
            className="text-gray-500 flex gap-1 text-sm cursor-pointer"
            onClick={() => {
              router.push(`/studentCourses/${courseId}?title=${course?.title}`);
            }}
          >
            <ArrowLeft />
            Back
          </p>
          <X
            className="h-4 w-4 cursor-pointer block lg:hidden"
            onClick={() => {
              setCourseDrawerState({
                data: null,
                status: false,
              });
            }}
          />
        </div>

        <h1 className="text-xl font-bold mt-4">{course?.title}</h1>
        {/* <div className="mt-4">
          <ProgressBar percentage={parseInt(course?.percentage)} className="h-1" />
          <div className="mt-1 flex gap-1 items-center">
            Course is
            <span className=" font-semibold">{parseInt(course?.percentage ?? 0).toFixed(0)}%</span>
            <span>complete</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProgressCourse;
