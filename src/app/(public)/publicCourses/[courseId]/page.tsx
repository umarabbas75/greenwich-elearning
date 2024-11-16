'use client';
import { useParams } from 'next/navigation';
import React from 'react';

import { useApiGet } from '@/lib/dashboard/client/user';

import HeroSection from './HeroSection';
import Syllabus from './Syllabus';
import WhatsIncluded from './WhatsIncluded';

const Page = () => {
  const { courseId } = useParams();

  const { data: coursesData } = useApiGet<any, Error>({
    endpoint: `/courses/public/${courseId}`,
    queryKey: ['courses-public-detail', courseId],

    config: {
      enabled: !!courseId,
      select: (res: any) => res?.data?.data,
      keepPreviousData: true,
    },
  });

  const { title, description, price, id } = coursesData || {};

  const totalElements = coursesData?.modules?.reduce((acc: any, cur: any) => {
    return acc + cur?._count?.chapters;
  }, 0);

  return (
    <div className="mb-24">
      <HeroSection title={title} desc={description} price={price} id={id} />
      <WhatsIncluded title={title} totalElements={totalElements} />
      <Syllabus units={coursesData?.modules} />
    </div>
  );
};

export default Page;
