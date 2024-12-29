import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useApiGet } from '@/lib/dashboard/client/user';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

import Spinner from '@/components/common/Spinner';

const HeroSection = ({ title, desc, id, price }: any) => {
  const { data: userData } = useSession();

  const [courseDetail, setCourseDetail] = useState<any>(null);

  const { isLoading, isRefetching } = useApiGet<any, Error>({
    endpoint: `/courses/getAllAssignedCourses/public/${userData?.user.id}`,
    queryKey: ['get-all-assigned-courses-public', userData?.user.id],
    config: {
      keepPreviousData: false,
      enabled: !!userData?.user.id,
      onSuccess: (res) => {
        const currentCourse = res?.data?.find((el: any) => el?.courseId === id);

        setCourseDetail(currentCourse);
      },
    },
  });

  const renderCourseStatus = () => {
    if (isLoading || isRefetching) {
      return <Spinner />;
    }

    if (!courseDetail) {
      return (
        <Link
          href={`${
            userData?.user.id
              ? `/assignCourse?courseId=${id}&userId=${userData?.user.id}`
              : `/signUp?courseId=${id}`
          }`}
        >
          <Button variant="public-primary" size="lg" className="w-[300px]">
            Buy course -{' '}
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0)}
          </Button>
        </Link>
      );
    }

    if (courseDetail?.isActive === false && userData?.user.id) {
      return (
        <div className="flex flex-col gap-2 justify-start items-start">
          <Button variant="public-primary" size="lg" className="min-w-[300px] cursor-default">
            The course has been assigned to you but is not yet active. Please contact the administrator to
            activate the course.
          </Button>

          {courseDetail?.isPaid === false && (
            <Link href={`/payment?courseId=${courseDetail?.courseId}&userId=${userData?.user.id}`}>
              <Button variant="public-secondary">Make the payment for this course</Button>
            </Link>
          )}
        </div>
      );
    }
    if (courseDetail?.isActive === true && userData?.user.id) {
      return (
        <Link href={`/studentCourses/${courseDetail?.courseId}?title=${courseDetail?.course?.title}`}>
          <Button variant="public-primary" size="lg" className="w-[300px]">
            Course is already assigned, go to the course
          </Button>
        </Link>
      );
    }
  };

  return (
    <>
      <div className="overflow-hidden">
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <Image
            src="/assets/images/course-detail.jpg"
            alt="Banner Image"
            layout="fill" // makes the image cover the full width and height
            objectFit="cover" // ensures the image covers the container without being stretched
            quality={100} // optional: to ensure good image quality
            className={'scaleImage'} // Apply animation to the first slide
          />
          <div
            className="absolute top-0 left-0 right-0 bg-black/70"
            style={{ width: '100vw', height: '100vh', position: 'relative' }}
          >
            <div className="container h-full">
              <div className="grid grid-cols-2 h-full">
                <div className="col-span-2 flex items-center">
                  <div>
                    <h1 className="text-white text-6xl font-semibold mb-2">{title}</h1>
                    <p className="text-white mb-6 max-w-lg">{desc}</p>
                    {renderCourseStatus()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
