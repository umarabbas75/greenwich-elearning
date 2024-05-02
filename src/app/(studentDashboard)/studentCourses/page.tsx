'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import CourseCardSkeleton from '@/components/common/CourseCardSkeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiGet } from '@/lib/dashboard/client/user';

import ActiveCourses from './_components/ActiveCourses';
import CompletedCourses from './_components/CompletedCourses';

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type');
  const { data: session } = useSession();
  const { data: assignedCourses, isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/getAllAssignedCourses/${session?.user.id}`,
    queryKey: ['get-sections', session?.user.id],
    config: {
      keepPreviousData: true,
    },
  });

  return (
    <div>
      <Tabs
        defaultValue={type ?? 'active'}
        className="w-full"
        onValueChange={(route) => {
          router.push(`/studentCourses?type=${route}`);
        }}
      >
        <TabsList className="md:grid md:w-[400px] grid-cols-2">
          <TabsTrigger value="active">Active Courses</TabsTrigger>

          <TabsTrigger value="completed">Completed Courses</TabsTrigger>
        </TabsList>

        {isLoading && <CourseCardSkeleton />}

        {(type == 'active' || !type) && (
          <ActiveCourses
            assignedCourses={assignedCourses?.data?.filter((item: any) => item?.percentage !== 100)}
          />
        )}
        {type == 'completed' && (
          <CompletedCourses
            assignedCourses={assignedCourses?.data?.filter((item: any) => item?.percentage === 100)}
          />
        )}
      </Tabs>
    </div>
  );
};

export default Page;
