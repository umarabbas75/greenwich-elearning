'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ActiveCourses from './_components/ActiveCourses';

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type');
  console.log({ type });

  return (
    <div>
      <Tabs
        defaultValue={type ?? 'active'}
        className="w-full"
        onValueChange={(route) => {
          console.log({ route });
          router.push(`/studentCourses?type=${route}`);
        }}
      >
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="active">Enrolled Courses</TabsTrigger>

          <TabsTrigger value="completed">Completed Courses</TabsTrigger>
        </TabsList>

        {(type == 'active' || !type) && <ActiveCourses />}
        {type == 'completed' && <div>completed</div>}
      </Tabs>
    </div>
  );
};

export default Page;
