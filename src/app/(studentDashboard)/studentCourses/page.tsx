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
    queryKey: ['get-all-assigned-courses', session?.user.id],
    config: {
      keepPreviousData: true,
    },
  });
  const activeCourses = assignedCourses?.data?.filter((item: any) => item?.percentage !== 100);
  const completedCourses = assignedCourses?.data?.filter((item: any) => item?.percentage === 100);

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
          <TabsTrigger value="active">Active Courses - {activeCourses?.length ?? 0}</TabsTrigger>

          <TabsTrigger value="completed">Completed Courses - {completedCourses?.length ?? 0}</TabsTrigger>
        </TabsList>

        {isLoading && <CourseCardSkeleton />}

        {(type == 'active' || !type) && <ActiveCourses assignedCourses={activeCourses} />}
        {type == 'completed' && <CompletedCourses assignedCourses={completedCourses} />}
      </Tabs>
    </div>
  );
};

export default Page;
