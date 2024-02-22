'use client';
import { useParams } from 'next/navigation';
import React from 'react';

import { SectionsDataResponse } from '@/app/(dashboard)/course/[courseId]/[moduleId]/[chapterId]/page';
import { useApiGet } from '@/lib/dashboard/client/user';

import SideBarAllSection from './_components/SideBarAllSection';

const Page = () => {
  const params = useParams();
  const { courseId, chapterId } = params;
  console.log({ courseId, chapterId });
  const { data: sectionsData, isLoading } = useApiGet<SectionsDataResponse, Error>({
    endpoint: `/courses/module/chapter/allSections/${chapterId}`,
    queryKey: ['get-sections', chapterId],
  });
  console.log({ sectionsData, isLoading });
  return (
    <div>
      <div className=" p-4 rounded-xl border bg-white">dsfds</div>
      <SideBarAllSection />
    </div>
  );
};

export default Page;
