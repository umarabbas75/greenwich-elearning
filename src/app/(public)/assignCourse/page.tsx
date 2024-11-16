'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { AlertDestructive } from '@/components/common/FormError';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { Icons } from '@/utils/icon';

const Page = () => {
  const params = useSearchParams();
  const courseId = params.get('courseId');
  const userId = params.get('userId');
  const router = useRouter();
  const { data: coursesData } = useApiGet<any, Error>({
    endpoint: `/courses/public/${courseId}`,
    queryKey: ['courses-public-detail', courseId],

    config: {
      enabled: !!courseId,
      select: (res: any) => res?.data?.data,
      keepPreviousData: true,
    },
  });

  const {
    mutate: assignCourse,
    isLoading: assigningCourse,
    isError: isAssignError,
    error: assignError,
  } = useApiMutation<any>({
    endpoint: `/courses/assignCourse/public`,
    method: 'put',
    sendDataInParams: true,
    config: {
      onSuccess: async () => {
        if (userId) {
          router.replace(`/payment?courseId=${courseId}&userId=${userId}`);
        }

        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record added successfully',
        });
      },
    },
  });

  return (
    <div className="bg-gray-100 flex-1 h-full">
      <div className="h-full">
        <div className="grid grid-cols-2 h-full">
          <div className="col-span-1 h-full flex items-center">
            <div className="py-6 px-12">
              {isAssignError && <AlertDestructive error={assignError} />}

              <h1 className="text-5xl font-medium">Assign this course to continue</h1>

              <p className="mt-4 text-gray-700">
                To start, please assign this course to your account. Once assigned, you will be guided to
                complete a bank transfer payment. After payment is confirmed, the admin will activate your
                course access, unlocking all the valuable resources.
              </p>

              <div className="mt-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <Icons iconName="user" className="w-6 h-6 text-publicRed" />
                  <p>Step 1: Assign the course to your account.</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Icons iconName="dashboard" className="w-6 h-6 text-publicRed" />
                  <p>Step 2: Make a manual bank transfer for the course fee.</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Icons iconName="edit" className="w-6 h-6 text-publicRed" />
                  <p>Step 3: Admin will activate the course upon payment confirmation.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const payload = {
                    userId: userId,
                    courseId: courseId,
                  };
                  assignCourse(payload);
                }}
                className="mt-8 w-full py-3 px-4 bg-publicBlue text-white font-medium rounded-md shadow-md hover:bg-red-600 transition-colors"
              >
                {assigningCourse ? 'assigning' : 'Assign course to myself'}
              </button>
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
