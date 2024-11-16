'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { useApiGet } from '@/lib/dashboard/client/user';

import PaymentSection from './PaymentSection';
const Page = () => {
  const params = useSearchParams();
  const courseId = params.get('courseId');

  const { data: coursesData } = useApiGet<any, Error>({
    endpoint: `/courses/public/${courseId}`,
    queryKey: ['courses-public-detail', courseId],

    config: {
      enabled: !!courseId,
      select: (res: any) => res?.data?.data,
      keepPreviousData: true,
    },
  });

  return (
    <div className="bg-gray-100 ">
      <div className="">
        <div className="grid grid-cols-2 ">
          <div className="col-span-1">
            <div className="py-6 px-12">
              <h1 className="text-5xl font-medium">Complete Your Payment</h1>
              <PaymentSection />
            </div>
          </div>
          <div className="col-span-1  ">
            <div className="bg-gray-300 h-full p-6 flex justify-between items-center gap-4">
              <img className="w-[180px] object-contain rounded-2xl" src={coursesData?.image} alt="" />
              <div>
                <div className="">
                  <h1 className="text-primary text-xl font-semibold mb-2">{coursesData?.title}</h1>
                  <p className="text-gray-700 mb-6">{coursesData?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
